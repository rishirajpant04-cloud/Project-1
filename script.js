/* =========================================
   NAVIGATION
========================================= */

const navigation = document.getElementById("navigation");

const openMenu = document.getElementById("open-menu");

const closeMenu = document.getElementById("navigation-button");

const mobileControls = [
    openMenu,
    document.getElementById("header-container")
];

const mobileControlsQuery =
    window.matchMedia("(max-width: 650px)");

let previousScrollY = window.scrollY;
let accumulatedScrollDelta = 0;
let scrollUpdatePending = false;


function setMobileControlsHidden(hidden) {

    mobileControls.forEach(control => {

        control.classList.toggle("scroll-hidden", hidden);
        control.inert = hidden;
        control.setAttribute("aria-hidden", String(hidden));

    });

}


function updateMobileControls() {

    const currentScrollY = window.scrollY;

    if (!mobileControlsQuery.matches) {

        setMobileControlsHidden(false);
        accumulatedScrollDelta = 0;

    } else if (currentScrollY < 80) {

        setMobileControlsHidden(false);
        accumulatedScrollDelta = 0;

    } else {

        accumulatedScrollDelta += currentScrollY - previousScrollY;

        if (accumulatedScrollDelta > 4) {

            setMobileControlsHidden(true);
            accumulatedScrollDelta = 0;

        } else if (accumulatedScrollDelta < -4) {

            setMobileControlsHidden(false);
            accumulatedScrollDelta = 0;

        }

    }

    previousScrollY = currentScrollY;

}


window.addEventListener("scroll", () => {

    if (!scrollUpdatePending) {

        scrollUpdatePending = true;

        window.requestAnimationFrame(() => {

            updateMobileControls();
            scrollUpdatePending = false;

        });

    }

}, { passive: true });


mobileControlsQuery.addEventListener("change", () => {

    previousScrollY = window.scrollY;
    accumulatedScrollDelta = 0;
    setMobileControlsHidden(false);

});


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

const jobTrack =
    document.querySelector(".job-track");

let currentJob = 0;


function updateJobSlider() {

    const maxScrollLeft =
        jobTrack.scrollWidth - jobTrack.clientWidth;

    const cards = Array.from(jobCards);

    currentJob = cards.reduce((closestIndex, card, index) => {

        const cardOffset =
            card.getBoundingClientRect().left -
            jobTrack.getBoundingClientRect().left +
            jobTrack.scrollLeft;

        const closestOffset =
            cards[closestIndex].getBoundingClientRect().left -
            jobTrack.getBoundingClientRect().left +
            jobTrack.scrollLeft;

        return Math.abs(cardOffset - jobTrack.scrollLeft) <
            Math.abs(closestOffset - jobTrack.scrollLeft)
            ? index
            : closestIndex;

    }, 0);

    const hasOverflow = maxScrollLeft > 1;
    const controlsVisible =
        hasOverflow && !mobileControlsQuery.matches;

    previousButton.hidden = !controlsVisible;
    nextButton.hidden = !controlsVisible;
    previousButton.disabled = currentJob === 0;
    nextButton.disabled = currentJob === cards.length - 1;

    progressBar.style.width = hasOverflow
        ? `${((currentJob + 1) / cards.length) * 100}%`
        : "100%";

}


function scrollToJob(index) {

    const card = jobCards[index];

    jobTrack.scrollTo({
        left:
            card.getBoundingClientRect().left -
            jobTrack.getBoundingClientRect().left +
            jobTrack.scrollLeft,
        behavior: "smooth"
    });

}


nextButton.addEventListener("click", () => {

    if (currentJob < jobCards.length - 1) {
        scrollToJob(currentJob + 1);
    }

});


previousButton.addEventListener("click", () => {

    if (currentJob > 0) {
        scrollToJob(currentJob - 1);
    }

});


jobTrack.addEventListener("scroll", updateJobSlider, { passive: true });
window.addEventListener("resize", updateJobSlider);
updateJobSlider();



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
