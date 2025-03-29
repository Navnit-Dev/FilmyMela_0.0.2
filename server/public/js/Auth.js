class Auth {
    constructor() {
        this.FormStatus = false;
        this.Init();
        this.InitListeners();
    }

    Init() {
        this.LoginForm = document.getElementById("AuthenticationForm");
        this.SignUp = document.getElementById("SignUp");
        this.SignIn = document.getElementById("SignIn") || '';
        this.UsernameField = document.getElementById("UsernameInput");
        this.Message = document.getElementById("ExUserMsg");
        this.SubmitBtn = document.getElementById("SubmitBtn");
        this.FormTitle = document.getElementById("FormTitle");
    }

    InitListeners() {
        this.SignUp.addEventListener("click", () => {
            this.FormStatus = !this.FormStatus;
            this.UsernameField.style.display = this.FormStatus ? "block" : "none";
            this.SignUp.textContent = this.FormStatus ? "Sign In" : "Create Account";
            this.Message.textContent = this.FormStatus ? "Already Registered?" : "Not Registered?";
            this.LoginForm.action = this.FormStatus ? "/api/signup" : "/api/login";
            this.SubmitBtn.textContent = this.FormStatus ? "Create An Account" : "Login To Your Account";
            this.FormTitle.textContent = this.FormStatus ? "Sign up to our platform" : "Sign in to our platform";
        });

        this.LoginForm.addEventListener("submit" , async (e)=> {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(this.LoginForm).entries());
            console.log(JSON.stringify(data));

            const res = await fetch(`${this.LoginForm.action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if(res.ok){
                const {message,Token,user,redirectTo} = await res.json();
                const Msg = this.FormStatus ? "Account Created Successfully" : "Welocme Back";
                if(message && Token){
                    console.log(message);
                    document.cookie = `token=${Token}`;
                    document.cookie = `user=${user._id}`;

                    Swal.fire({
                        icon: 'success',
                        title: `${message}`,
                        text: `${Msg}`,
                        confirmButtonText: "OK"
                    }).then((result)=> {
                        if(result.isConfirmed  ){
                            window.location.href = `${redirectTo}`;
                        }
                    });

                }
                
            }
            else{
                const {message} = await res.json();
                if(message){
                    Swal.fire({
                        icon: 'warning',
                        title: `${message}`,
                        text: `Check Your Credentials`,
                        confirmButtonText: "Retry"
                    })
                }
            }
        })
        
    
    }
}



new Auth();