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

/* =========================================
   APPLICATION FLOW — apply, review, edit
   (demo storage: this browser only)
========================================= */

const STORAGE_KEY = "htp_applications";

const STATUS_META = {
    pending: {
        label: "Pending Review",
        className: "status-pending",
        message:
            "Your application is in the queue. Our team reviews new applications in the order they arrive."
    },
    review: {
        label: "Under Review",
        className: "status-review",
        message:
            "A consultant is currently reviewing your details. We'll contact you using the phone and email on file."
    },
    approved: {
        label: "Approved",
        className: "status-approved",
        message:
            "Congratulations — your application has been approved. Expect a call from our team shortly."
    },
    rejected: {
        label: "Not Progressed",
        className: "status-rejected",
        message:
            "This application was not progressed. You're welcome to update your details and reapply."
    }
};

const FIELD_LABELS = {
    fullname: "Full Name",
    profession: "Profession",
    education: "Education",
    speciality: "Speciality",
    fluencyType: "Fluency Test",
    fluencyScore: "Score",
    phone: "Phone Number",
    email: "Email Address",
    essay: "About Yourself"
};


/* ---- Storage helpers ---- */

function loadApplications() {

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }

}

function saveApplications(list) {

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
        /* storage unavailable — demo data simply won't persist */
    }

}

function nextApplicantId(list) {

    let highest = 0;

    list.forEach(item => {
        const numeric = parseInt(String(item.id).replace(/\D/g, ""), 10);
        if (!Number.isNaN(numeric) && numeric > highest) {
            highest = numeric;
        }
    });

    return "HP" + String(highest + 1).padStart(6, "0");

}


/* ---- Modal helpers ---- */

let lastFocusedElement = null;

function openModal(overlay) {

    lastFocusedElement = document.activeElement;

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("nav-open");

    const focusTarget = overlay.querySelector(
        "input, select, textarea, button:not(.modal-close)"
    );

    if (focusTarget) {
        window.setTimeout(() => focusTarget.focus(), 60);
    }

}

function closeModal(overlay) {

    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("nav-open");

    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }

}

function showView(container, viewToShow) {

    container.querySelectorAll(".modal-view").forEach(view => {
        view.hidden = view !== viewToShow;
    });

}

function showError(element, message) {

    element.textContent = message;
    element.hidden = false;

}

function clearError(element) {

    element.textContent = "";
    element.hidden = true;

}


/* ---- Validation ---- */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^[+\d][\d\s().-]{6,}$/;

function readFields(prefix) {

    return {
        fullname: document.getElementById(prefix + "fullname"),
        profession: document.getElementById(prefix + "profession"),
        education: document.getElementById(prefix + "education"),
        speciality: document.getElementById(prefix + "speciality"),
        fluencyType: document.getElementById(prefix + "fluency-type"),
        fluencyScore: document.getElementById(prefix + "fluency-score"),
        phone: document.getElementById(prefix + "phone"),
        email: document.getElementById(prefix + "email"),
        essay: document.getElementById(prefix + "essay")
    };

}

function validateFields(fields) {

    const values = {};
    const missing = [];

    Object.keys(fields).forEach(key => {

        const input = fields[key];
        const value = (input.value || "").trim();

        input.classList.remove("invalid");

        if (!value) {
            input.classList.add("invalid");
            missing.push(FIELD_LABELS[key]);
        }

        values[key] = value;

    });

    if (missing.length) {
        return {
            ok: false,
            message: "Please complete: " + missing.join(", ") + "."
        };
    }

    if (!emailPattern.test(values.email)) {
        fields.email.classList.add("invalid");
        return { ok: false, message: "Please enter a valid email address." };
    }

    if (!phonePattern.test(values.phone)) {
        fields.phone.classList.add("invalid");
        return { ok: false, message: "Please enter a valid phone number." };
    }

    return { ok: true, values: values };

}


/* ---- Apply modal ---- */

const applyModal = document.getElementById("apply-modal");
const applyButton = document.getElementById("apply-button");
const applyClose = document.getElementById("apply-modal-close");
const applyForm = document.getElementById("apply-form");
const applyFormView = document.getElementById("apply-form-view");
const applyConfirmView = document.getElementById("apply-confirm-view");
const applyFormError = document.getElementById("apply-form-error");
const applyConfirmClose = document.getElementById("apply-confirm-close");
const applyConfirmReview = document.getElementById("apply-confirm-review");

const applyFields = readFields("field-");

applyButton.addEventListener("click", () => {

    clearError(applyFormError);
    showView(applyModal, applyFormView);
    openModal(applyModal);

});

applyClose.addEventListener("click", () => closeModal(applyModal));

applyConfirmClose.addEventListener("click", () => closeModal(applyModal));

applyForm.addEventListener("submit", event => {

    event.preventDefault();

    const result = validateFields(applyFields);

    if (!result.ok) {
        showError(applyFormError, result.message);
        return;
    }

    clearError(applyFormError);

    const applications = loadApplications();

    const record = Object.assign({}, result.values, {
        id: nextApplicantId(applications),
        status: "pending",
        submittedAt: new Date().toISOString()
    });

    applications.push(record);
    saveApplications(applications);

    document.getElementById("confirm-applicant-id").textContent = record.id;
    document.getElementById("confirm-applicant-name").textContent = record.fullname;

    applyForm.reset();

    showView(applyModal, applyConfirmView);

});


/* ---- Review modal ---- */

const reviewModal = document.getElementById("review-modal");
const reviewButton = document.getElementById("review-button");
const reviewClose = document.getElementById("review-modal-close");

const reviewLookupView = document.getElementById("review-lookup-view");
const reviewResultView = document.getElementById("review-result-view");
const reviewEditView = document.getElementById("review-edit-view");

const reviewLookupError = document.getElementById("review-lookup-error");
const reviewLookupSubmit = document.getElementById("review-lookup-submit");

const lookupName = document.getElementById("lookup-fullname");
const lookupId = document.getElementById("lookup-id");

const reviewStatusBadge = document.getElementById("review-status-badge");
const reviewStatusMessage = document.getElementById("review-status-message");
const reviewDetailList = document.getElementById("review-detail-list");

const reviewEditButton = document.getElementById("review-edit-button");
const reviewBackButton = document.getElementById("review-back-button");
const reviewEditForm = document.getElementById("review-edit-form");
const reviewEditCancel = document.getElementById("review-edit-cancel");
const instantReviewButton = document.getElementById("instant-review-button");

const editFields = readFields("edit-");

let activeApplication = null;


function openReviewModal() {

    clearError(reviewLookupError);
    showView(reviewModal, reviewLookupView);
    openModal(reviewModal);

}

reviewButton.addEventListener("click", openReviewModal);

reviewClose.addEventListener("click", () => closeModal(reviewModal));

applyConfirmReview.addEventListener("click", () => {

    closeModal(applyModal);
    openReviewModal();

});


function renderApplication(record) {

    const meta = STATUS_META[record.status] || STATUS_META.pending;

    reviewStatusBadge.className = meta.className;
    reviewStatusBadge.textContent = meta.label;

    reviewStatusMessage.textContent = meta.message;

    reviewDetailList.innerHTML = "";

    const rows = [["Applicant ID", record.id]].concat(
        Object.keys(FIELD_LABELS).map(key => [FIELD_LABELS[key], record[key] || "—"])
    );

    rows.forEach(([label, value]) => {

        const row = document.createElement("div");
        row.className = "detail-row";

        const labelNode = document.createElement("span");
        labelNode.className = "detail-label";
        labelNode.textContent = label;

        const valueNode = document.createElement("span");
        valueNode.className = "detail-value";
        valueNode.textContent = value;

        row.appendChild(labelNode);
        row.appendChild(valueNode);

        reviewDetailList.appendChild(row);

    });

    showView(reviewModal, reviewResultView);

}


reviewLookupSubmit.addEventListener("click", () => {

    const name = (lookupName.value || "").trim().toLowerCase();
    const id = (lookupId.value || "").trim().toUpperCase();

    lookupName.classList.remove("invalid");
    lookupId.classList.remove("invalid");

    if (!name || !id) {

        if (!name) lookupName.classList.add("invalid");
        if (!id) lookupId.classList.add("invalid");

        showError(reviewLookupError, "Enter both your full name and applicant ID.");
        return;

    }

    const match = loadApplications().find(item =>
        String(item.id).toUpperCase() === id &&
        String(item.fullname).trim().toLowerCase() === name
    );

    if (!match) {
        showError(
            reviewLookupError,
            "No application found with those details on this device. Check the spelling of your name and your applicant ID."
        );
        return;
    }

    clearError(reviewLookupError);

    activeApplication = match;

    renderApplication(match);

});


reviewBackButton.addEventListener("click", () => {

    activeApplication = null;

    lookupName.value = "";
    lookupId.value = "";

    clearError(reviewLookupError);
    showView(reviewModal, reviewLookupView);

});


reviewEditButton.addEventListener("click", () => {

    if (!activeApplication) return;

    Object.keys(editFields).forEach(key => {
        editFields[key].value = activeApplication[key] || "";
        editFields[key].classList.remove("invalid");
    });

    showView(reviewModal, reviewEditView);

});


reviewEditCancel.addEventListener("click", () => {

    if (activeApplication) {
        renderApplication(activeApplication);
    } else {
        showView(reviewModal, reviewLookupView);
    }

});


reviewEditForm.addEventListener("submit", event => {

    event.preventDefault();

    if (!activeApplication) return;

    const result = validateFields(editFields);

    if (!result.ok) {
        window.alert(result.message);
        return;
    }

    const applications = loadApplications();

    const index = applications.findIndex(item => item.id === activeApplication.id);

    if (index === -1) return;

    applications[index] = Object.assign({}, applications[index], result.values, {
        updatedAt: new Date().toISOString()
    });

    saveApplications(applications);

    activeApplication = applications[index];

    renderApplication(activeApplication);

});


instantReviewButton.addEventListener("click", () => {

    let note = document.getElementById("instant-review-note");

    if (!note) {
        note = document.createElement("p");
        note.id = "instant-review-note";
        note.className = "instant-review-note";
        instantReviewButton.parentElement.appendChild(note);
    }

    note.hidden = false;
    note.textContent = "Instant review checkout is coming soon.";

});


/* ---- Shared close behaviour ---- */

[applyModal, reviewModal].forEach(overlay => {

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeModal(overlay);
        }
    });

});

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

    [applyModal, reviewModal].forEach(overlay => {
        if (overlay.classList.contains("active")) {
            closeModal(overlay);
        }
    });

});
