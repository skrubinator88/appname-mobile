CYAN='\033[1;36m'
GREEN='\033[0;32m'
CYAN2='\033[0;36 m'
NC='\033[0m' 

printf "\n\n"
printf "${CYAN}pushing to github${NC} \n\n"
# Enable when initial git
# git remote add origin git@github.com:BryanEnid/appname-mobile.git
git remote set-url origin git@github.com:BryanEnid/appname-mobile.git
git push -u origin master 
printf "\n\n\n"

printf "${CYAN}pushing to bitbucket${NC} \n\n"
# Enable when initial git
# git remote add origin git@bitbucket.org:enidtech/appname-frontend.git
git remote set-url origin git@bitbucket.org:enidtech/appname-mobile.git
git push -u origin master
printf "\n\n\n"