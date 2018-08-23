class LoginBtn {
    constructor() {
        addEventListenerToTarget($("#login .login-box form button.btn-login"), "click", this.loginBtnHandler.bind(this))
    }

    loginBtnHandler(evt) {
        evt.preventDefault();

        this.loginForm = {
            "email": $("#email").value,
            "password": $("#pwd").value
        };

        $("#pwd").value = "";

        fetchManager({
            url: '/api/users/login',
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(this.loginForm),
            callback: this.login
        });
    }

    login(response) {
        if (response.status === 200) {
            location.href = "/";
            return;
        }
        $("p.err-msg").style.display = "block";
    }
}

class Join {
    constructor() {
        addEventListenerToTarget($("#email-domain-select"), "change", this.domainSelectChangeHandler.bind(this))
        addEventListenerToTarget($(".join-form-box .btn"), "click", this.joinBtnClickHandler.bind(this));
        this.focusOutTargetList = [$("input#email-domain"), $("input#pw1"), $("input#pw2"), $("input#name"), $("input#cell3"), $("input#address")];
        this.focusOutTargetList.forEach(target => {
            addEventListenerToTarget(target, "focusout", this.focusOutHandler.bind(this));
        })
    }

    focusOutHandler(evt) {
        if (evt.target.id === "email-domain")
            this.validEmail();
        if (evt.target.id === "pw1")
            this.validPassword();
        if (evt.target.id === "pw2")
            this.validPasswordConfirm();
        if (evt.target.id === "name")
            this.validName();
        if (evt.target.id === "cell3")
            this.validPhoneNo();
        if (evt.target.id === "address")
            this.validAddress();
    }

    domainSelectChangeHandler(evt) {
        this.emailDomain = $("input#email-domain");

        if (evt.target.value === "0") {
            this.emailDomain.value = "";
            this.emailDomain.disabled = false;
            return;
        }

        this.emailDomain.value = evt.target.value;
        this.emailDomain.disabled = true;

        this.validEmail();
    }

    joinBtnClickHandler(evt) {
        evt.preventDefault();

        if (!this.validAll())
            return;

        this.joinForm = {
            "email": this.email,
            "password": this.password,
            "name": this.name,
            "phoneNo": this.phoneNo,
            "address": this.address
        };

        $("#pw1").value = "";
        $("#pw2").value = "";

        fetchManager({
            url: '/api/users',
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(this.joinForm),
            callback: this.join
        });
    }

    validAll() {
        this.validList = [this.validEmail.bind(this), this.validPassword.bind(this), this.validPasswordConfirm.bind(this),
            this.validName.bind(this), this.validPhoneNo.bind(this), this.validAddress.bind(this)];
        this.cnt = this.validList.length;
        this.validList.forEach(valid => {
            if (valid())
                this.cnt--;
        });
        return this.cnt === 0;
    }

    validEmail() {
        this.emailPattern = /^[_0-9a-zA-Z-]+@[0-9a-zA-Z]+(.[_0-9a-zA-Z-]+)*$/;
        this.email = $("#email-id").value + "@" + $("#email-domain").value;
        if (!this.emailPattern.test(this.email)) {
            $("#email-caution").style.display = "inline-block";
            return false;
        }
        $("#email-caution").style.display = "none";
        return true;
    }

    validPassword() {
        this.passwordPattern = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/;
        this.password = $("#pw1").value;
        if (!this.passwordPattern.test(this.password)) {
            $("#password-caution").style.display = "inline-block"
            return false;
        }
        $("#password-caution").style.display = "none"
        return true;
    }

    validPasswordConfirm() {
        this.confirmPassword = $("#pw2").value;
        if (this.password !== this.confirmPassword) {
            $("#password-confirm-caution").style.display = "inline-block";
            return false;
        }
        $("#password-confirm-caution").style.display = "none";
        return true;
    }

    validName() {
        this.name = $("#name").value;
        if (!this.name) {
            $("#name-caution").style.display = "inline-block";
            return false;
        }
        $("#name-caution").style.display = "none";
        return true;
    }

    validPhoneNo() {
        this.phoneNoPattern = /^01[0|1|6-9]-[0-9]{3,4}-[0-9]{4}$/;
        this.phoneNo = $("#cell1").value + "-" + $("#cell2").value + "-" + $("#cell3").value;
        if (!this.phoneNoPattern.test(this.phoneNo)) {
            $("#phone-caution").style.display = "inline-block";
            return false;
        }
        $("#phone-caution").style.display = "none";
        return true;
    }

    validAddress() {
        this.address = $("#address").value;
        if (!this.address) {
            $("#address-caution").style.display = "inline-block";
            return false;
        }
        $("#address-caution").style.display = "none";
        return true;
    }

    join(response) {
        if (response.status === 201) {
            location.href = "/";
        }
        //todo: 에러처리
    }

}

document.addEventListener("DOMContentLoaded", () => {
    new LoginBtn();
    new Join();
});
