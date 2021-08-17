import * as firebase from "firebase";
import { firestore, GeoFirestore } from "../config/firebase";
import config from "../env";
import JobsStoreActions from "../rdx-actions/jobs.action";
import ListingsActions from "../rdx-actions/listings.action";

const Actions = { JobsStoreActions, ListingsActions };

exports.currentUserCompletedJobs = (userID, dispatch) => {
	const query = GeoFirestore.collection("jobs")
		.where("posted_by", "==", userID)
		.where("status", "in", ["complete", "disputed"]);

	const unsubscribe = query.onSnapshot((res) => {
		const jobs = [];
		res.forEach((snap) => {
			jobs.push({ ...snap.data(), id: snap.id, _id: snap.id });
		});
		return dispatch(ListingsActions.add(jobs));
	});

	return unsubscribe;
};

exports.getJobTagType = (imageType) => {
	switch (imageType) {
		case "user":
			return require("../assets/map-marker.png");
	}
};

exports.clean = (ProviderName, unsubscribe, dispatch) => {
	if (unsubscribe) {
		unsubscribe(); // Unsubscribe from firebase
	}

	if (dispatch) dispatch(Actions[ProviderName].clear()); // Clear state
};

exports.deleteJob = async (documentID) => {
	const geoCollection = GeoFirestore.collection("jobs").doc(documentID);
	// Ideally, there should be checks here in order to prevent jobs that are in progress from being deleted
	await geoCollection.delete();
};

exports.changeJobStatus = async (documentID, status, userID = "") => {
	const geoCollection = GeoFirestore.collection("jobs").doc(documentID);

	// Update job status
	await geoCollection.update({ status, executed_by: userID });
};

exports.acceptJob = async (jobID, authState) => {
	const apiResponse = await fetch(`${config.API_URL}/users/acceptJob`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `bearer ${authState.userToken}`,
		},
		body: JSON.stringify({ jobID }),
	});
	if (!apiResponse.ok) {
		throw new Error((await apiResponse.json()).message || "Failed to accept job");
	}

	return true;
};

exports.cancelAcceptedJob = async (jobID, authState) => {
	const {
		userData: { role },
	} = authState;

	const apiResponse = await fetch(`${config.API_URL}/users/cancelJob`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `bearer ${authState.userToken}`,
		},
		body: JSON.stringify({ jobID, role }),
	});
	if (!apiResponse.ok) {
		throw new Error((await apiResponse.json()).message || "Failed to cancel job");
	}

	return true;
};

exports.cancelReviewedJob = async (documentID, authState) => {
	const {
		userData: { role },
	} = authState;
	const geoCollection = GeoFirestore.collection("jobs").doc(documentID);

	if (role === "contractor") {
		throw new Error("Unauthorized action")
	}

	// Update job status
	await geoCollection.update({
		offer_received: firebase.firestore.FieldValue.delete(),
		executed_by: firebase.firestore.FieldValue.delete(),
		status: "available",
	});
};

/**
 * Used to send an offer by a deployee
 * @param {*} documentID
 * @param {*} deployee
 * @param {*} offer
 */
exports.sendOffer = async (documentID, deployee, offer, wage = "deployment") => {
	if (!deployee) {
		throw new Error("User identity must be provided");
	}
	if (!offer) {
		throw new Error("You must provide a valid offer");
	}
	if (parseFloat(offer) < 5) {
		throw new Error("Offer must be at least $5")
	}

	const doc = GeoFirestore.collection("jobs").doc(documentID);
	const offer_received = {
		deployee,
		offer,
		wage,
		approved: false,
	};

	await doc.update({
		offer_received,
	});
	return offer_received;
};

/**
 * Used by deployee or deployer to cancel an offer already sent
 *
 * @param {*} documentID
 */
exports.cancelOffer = async (documentID) => {
	const doc = GeoFirestore.collection("jobs").doc(documentID);
	await doc.update({
		offer_received: firebase.firestore.FieldValue.delete(),
		executed_by: "",
		status: "available",
	});
};

exports.approveOffer = async (jobID, deployee, authState) => {
	if (!deployee) {
		throw new Error("User identity must be provided");
	}

	const apiResponse = await fetch(`${config.API_URL}/users/acceptOffer`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `bearer ${authState.userToken}`,
		},
		body: JSON.stringify({ jobID, deployee }),
	});
	if (!apiResponse.ok) {
		throw new Error((await apiResponse.json()).message || "Failed to accept offer");
	}

	return true;
};

exports.counterOffer = async (documentID, offer, wage) => {
	if (!offer) {
		throw new Error("Offer must be provided");
	}
	if (parseFloat(offer) < 5) {
		throw new Error("Offer must be at least $5")
	}
	const doc = GeoFirestore.collection("jobs").doc(documentID);
	await doc.update({
		"offer_received.counterOffer": offer,
		"offer_received.counterWage": wage || 'deployment',
	});
};

exports.counterApprove = async (jobID, offer, authState) => {
	if (!offer) {
		throw new Error("Offer must be provided");
	}
	if (parseFloat(offer) < 5) {
		throw new Error("Offer must be at least $5")
	}

	const apiResponse = await fetch(`${config.API_URL}/users/acceptJob`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `bearer ${authState.userToken}`,
		},
		body: JSON.stringify({ jobID }),
	});
	if (!apiResponse.ok) {
		throw new Error((await apiResponse.json()).message || "Failed to accept job");
	}

	return true;
};

exports.validateQrCode = async (contractor_id, qr_code) => {
	if (!contractor_id || !qr_code) {
		throw new Error("Invalid QR Code provided")
	}
	const document = firestore.collection("jobs").doc(qr_code)

	return await (document.get()
		.then((doc) => {
			const data = doc.data();
			if (doc.exists && data.executed_by === contractor_id) {
				document.update({ status: "in progress" })
			} else {
				throw new Error("Invalid QR Code provided")
			}
		}));
};

exports.currentUserJobsHistory = (user) => { };

exports.completeJob = async (jobID, authState, image) => {
	const body = new FormData();
	const uriSplit = image.uri.split("/");
	body.append('photo', {
		uri: image.uri,
		type: image.type,
		name: uriSplit[uriSplit.length - 1],
	})

	const apiResponse = await fetch(`${config.API_URL}/users/completeJob`, {
		method: "POST",
		headers: {
			Authorization: `bearer ${authState.userToken}`,
			'x-job-id': jobID,
		},
		body,
	});
	if (!apiResponse.ok) {
		throw new Error((await apiResponse.json()).message || "Failed to complete job");
	}

	return true;
};

exports.reportJob = async (id, user, topic, details, authState) => {
	const apiResponse = await fetch(`${config.API_URL}/job/report`, {
		method: "POST",
		headers: {
			Authorization: `bearer ${authState.userToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			jobID: id,
			reportedUser: user,
			topic,
			details
		}),
	});
	if (!apiResponse.ok) {
		throw new Error((await apiResponse.json()).message || "Failed to report job");
	}

	return true;
};

exports.postUserJob = async (userID, job, token, photos = []) => {
	if (!userID) throw new Error("User ID is required");
	if (!job) throw new Error("A job is required");

	const newJob = {
		posted_by: userID,
		posted_by_profile_picture: `/images/${userID}.jpg`,
		date_created: new Date(),
		date_completed: null,
		star_rate: null,
		status: "available",
		...job,
	};

	const geoCollection = GeoFirestore.collection("jobs"); // Create a GeoCollection reference
	const { coordinates, salary } = newJob;
	if (parseFloat(salary) < 5) {
		throw new Error("Salary must be at least $5")
	}
	const GeoPoint = new firebase.firestore.GeoPoint(...coordinates);

	let newJobDoc;
	let filenames = null;
	try {
		newJobDoc = geoCollection.doc();
		if (photos && photos.length > 0) {
			const body = new FormData();
			photos.map((photo) => {
				const uriSplit = photo.uri.split("/");
				body.append("photo", {
					uri: photo.uri,
					type: photo.type,
					name: uriSplit[uriSplit.length - 1],
				});
			});

			const apiResponse = await fetch(`${config.API_URL}/job/upload`, {
				method: "POST",
				headers: {
					Authorization: `bearer ${token}`,
					"x-job-id": newJobDoc.id,
				},
				body,
			});
			if (!apiResponse.ok) {
				throw new Error((await apiResponse.json()).message || "Failed to upload job");
			}

			filenames = (await apiResponse.json()).data;
		}

		return newJobDoc
			.set({ ...newJob, coordinates: GeoPoint, photo_files: filenames })
			.then(() => {
				return new Promise((resolution) => {
					resolution({ success: true, job: { ...newJob, _id: newJobDoc.id, id: newJobDoc.id } });
				});
			})
			.catch((error) => {
				return new Promise((resolution, rejection) => {
					rejection({ success: false, error: error.message });
				});
			});
	} catch (e) {
		console.log(e);
		if (newJobDoc) {
			newJobDoc.delete();
		}
		throw e;
	}
};

exports.updateUserJob = async (userID, job, token, photos = []) => {
	if (!userID) throw new Error("User ID is required");
	if (!job) throw new Error("A job is required");

	const newJob = {
		status: "available",
		...job,
	};

	const geoCollection = GeoFirestore.collection("jobs"); // Create a GeoCollection reference
	const { coordinates, salary } = newJob;
	if (parseFloat(salary) < 5) {
		throw new Error("Salary must be at least $5")
	}
	const GeoPoint = new firebase.firestore.GeoPoint(...coordinates);

	let newJobDoc;
	let filenames = null;

	try {
		newJobDoc = geoCollection.doc(job.id);
		if (photos && photos.length > 0) {
			const body = new FormData();

			photos.map((photo) => {
				const uriSplit = photo.uri.split("/");
				body.append("photo", {
					uri: photo.uri,
					type: photo.type,
					name: uriSplit[uriSplit.length - 1],
				});
			});

			const apiResponse = await fetch(`${config.API_URL}/job/upload`, {
				method: "POST",
				headers: {
					Authorization: `bearer ${token}`,
					"x-job-id": newJobDoc.id,
				},
				body,
			});

			if (!apiResponse.ok) {
				throw new Error((await apiResponse.json()).message || "Failed to upload job");
			}

			filenames = (await apiResponse.json()).data;
		}

		return newJobDoc
			.set({ ...newJob, coordinates: GeoPoint, photo_files: filenames }, { merge: true })
			.then(() => {
				return new Promise((resolution, rejection) => {
					resolution({ success: true, job: { ...newJob, _id: newJobDoc.id, id: newJobDoc.id } });
				});
			})
			.catch((error) => {
				return new Promise((resolution, rejection) => {
					rejection({ success: false, error: error.message });
				});
			});
	} catch (e) {
		console.log(e);
		if (newJobDoc) {
			newJobDoc.delete();
		}
		throw e;
	}
};

exports.getUserJobComments = async (userID, state) => {
	// Screen State
	const { setComments, limit } = state;

	const query = GeoFirestore.collection("comments")
		.doc(userID)
		.collection("messages")
		.limit(limit ? limit : 50);

	let comments = [];

	const querySnapshot = await query.get();
	querySnapshot.forEach((doc) => {
		const comment = doc.data();
		comment.id = doc.id;
		comments.push(comment);
	});

	return setComments(comments);
};
