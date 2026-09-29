/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("active");

});


/* Close menu when clicking a navigation link */

document.querySelectorAll(".nav-links a").forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("active");

    });

});


/* =========================
   CONTACT FORM VALIDATION
========================= */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const subject =
        document.getElementById("subject").value.trim();

    const message =
        document.getElementById("message").value.trim();


    /* Name */

    if (name === "") {

        formMessage.textContent =
            "Please enter your name.";

        return;
    }


    /* Email */

    if (email === "") {

        formMessage.textContent =
            "Please enter your email.";

        return;
    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        formMessage.textContent =
            "Please enter a valid email address.";

        return;
    }


    /* Subject */

    if (subject === "") {

        formMessage.textContent =
            "Please enter a subject.";

        return;
    }


    /* Message */

    if (message === "") {

        formMessage.textContent =
            "Please enter your message.";

        return;
    }


    /* Success */

    formMessage.textContent =
        "Message validated successfully!";

    contactForm.reset();

});