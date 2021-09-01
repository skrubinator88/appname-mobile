import { duration } from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Text from './text';

export function Countdown({ durationInMinutes }) {
    const [currentTime, setCurrentTime] = useState(durationInMinutes);
    const timerRef = useRef();

    useEffect(() => {
        if (durationInMinutes <= 0) {
            return
        }
        // Set a timer to run every minute
        timerRef.current = setInterval(() => {
            if (currentTime <= 0) {
                clearInterval(timerRef.current)
                return
            }
            setCurrentTime(currentTime - 1)
        }, 60000)
        return () => clearInterval(timerRef.current)
    }, [])

    return <Text>{duration(currentTime, 'minutes').humanize()}</Text>
}