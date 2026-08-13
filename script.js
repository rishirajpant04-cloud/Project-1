/* =========================================
   NAVIGATION
========================================= */

const navigation = document.getElementById("navigation");

const openMenu = document.getElementById("open-menu");

const closeMenu = document.getElementById("navigation-button");


/* Open menu */

openMenu.addEventListener("click", () => {

    navigation.classList.add("active");

    document.body.style.overflow = "hidden";

});


/* Close menu */

closeMenu.addEventListener("click", () => {

    navigation.classList.remove("active");

    document.body.style.overflow = "";

});


/* Close menu when navigation link is clicked */

const navigationLinks =
    navigation.querySelectorAll("a");

navigationLinks.forEach(link => {

    link.addEventListener("click", () => {

        navigation.classList.remove("active");

        document.body.style.overflow = "";

    });

});


/* Close menu with Escape */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        navigation.classList.remove("active");

        document.body.style.overflow = "";

    }

});



/* =========================================
   JOB OPPORTUNITY SLIDER
========================================= */

const jobCards =
    document.querySelectorAll(".job-card");

const nextButton =
    document.querySelector(".slider-button.next");

const previousButton =
    document.querySelector(".slider-button.prev");

const progressBar =
    document.querySelector(".progress-bar");


let currentJob = 0;


/* Show selected job */

function showJob(index) {

    jobCards.forEach(card => {

        card.classList.remove("active");

    });

    jobCards[index].classList.add("active");


    /* Update progress */

    const progress =
        ((index + 1) / jobCards.length) * 100;

    progressBar.style.width =
        `${progress}%`;

}


/* Next */

nextButton.addEventListener("click", () => {

    currentJob++;

    if (currentJob >= jobCards.length) {
        currentJob = 0;
    }

    showJob(currentJob);

});


/* Previous */

previousButton.addEventListener("click", () => {

    currentJob--;

    if (currentJob < 0) {
        currentJob = jobCards.length - 1;
    }

    showJob(currentJob);

});


/* Auto slide */

let autoSlide =
    setInterval(() => {

        currentJob++;

        if (currentJob >= jobCards.length) {
            currentJob = 0;
        }

        showJob(currentJob);

    }, 6000);


/* Stop automatic movement when user interacts */

nextButton.addEventListener(
    "click",
    () => {
        clearInterval(autoSlide);
    }
);

previousButton.addEventListener(
    "click",
    () => {
        clearInterval(autoSlide);
    }
);



/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".section, .benefit, .partner, .contact-item"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "revealed"
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});