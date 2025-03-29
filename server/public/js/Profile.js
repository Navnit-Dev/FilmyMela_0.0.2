class Profile{
    constructor(User){
        this.User = User;
        this.ProfileDiv = document.getElementById("ProfileDiv");
        this.LoginBtn = document.getElementById("SignInBtn");
        this.SignUpBtn = document.getElementById("SignUpBtn");
        this.ProfileBtn = document.getElementById("ProfileBtn");
        this.ProfileUsername = document.getElementById("ProfileUsername");
        this.ProfileEmail = document.getElementById("ProfileEmail");
        this.Init();
    }

    async Init(){
        this.ProfileBtn.style.display = this.User ? "block" : "none";
        this.LoginBtn.style.display = this.User ? "none" : "block";
        this.SignUpBtn.style.display = this.User ? "none" : "block";

        const User = await fetch(`/api/user/${this.User}`);
        const {username,email} = await User.json();
        this.ProfileUsername.textContent = username;
        this.ProfileEmail.textContent = email;
    }

}



document.addEventListener("DOMContentLoaded",()=>{
    function getCookie(name) {
        let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
      }
    
      const User = getCookie("user") || null;

      new Profile(User);
})