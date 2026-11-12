let reports =
JSON.parse(localStorage.getItem("campusReports")) || [
    {
        id: 1,
        category: "Electrical",
        location: "Block A - Room 204",
        description: "Ceiling fan is not working.",
        priority: "Medium",
        status: "Pending",
        date: new Date().toLocaleDateString()
    },

    {
        id: 2,
        category: "Plumbing",
        location: "Library - First Floor",
        description: "Water leakage near the ceiling.",
        priority: "High",
        status: "In Progress",
        date: new Date().toLocaleDateString()
    },

    {
        id: 3,
        category: "Furniture",
        location: "Block B - Room 102",
        description: "Broken student desk.",
        priority: "Low",
        status: "Resolved",
        date: new Date().toLocaleDateString()
    }
];


function saveReports() {

    localStorage.setItem(
        "campusReports",
        JSON.stringify(reports)
    );

}


function showPage(pageName) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    document
        .getElementById(pageName)
        .classList.add("active");

    window.scrollTo(0, 0);

    if (pageName === "reports") {
        displayReports();
    }

    if (pageName === "dashboard") {
        updateDashboard();
    }
}


document
.getElementById("reportForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const category =
        document.getElementById("category").value;

    const location =
        document.getElementById("location").value;

    const description =
        document.getElementById("description").value;

    const priority =
        document.getElementById("priority").value;

    const newReport = {

        id: Date.now(),

        category: category,

        location: location,

        description: description,

        priority: priority,

        status: "Pending",

        date: new Date().toLocaleDateString()

    };

    reports.unshift(newReport);

    saveReports();

    alert("Report submitted successfully!");

    document
        .getElementById("reportForm")
        .reset();

    showPage("reports");

});


function displayReports() {

    const list =
        document.getElementById("reportList");

    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const status =
        document
        .getElementById("statusFilter")
        .value;

    const priority =
        document
        .getElementById("priorityFilter")
        .value;

    let filteredReports =
        reports.filter(report => {

            const matchesSearch =
                report.category
                .toLowerCase()
                .includes(search)

                ||

                report.location
                .toLowerCase()
                .includes(search)

                ||

                report.description
                .toLowerCase()
                .includes(search);

            const matchesStatus =
                status === "All"
                ||
                report.status === status;

            const matchesPriority =
                priority === "All"
                ||
                report.priority === priority;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        });


    if (filteredReports.length === 0) {

        list.innerHTML = `
            <div class="empty">
                <h3>No reports found</h3>

                <p>
                    Try changing your search or filters.
                </p>
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    filteredReports.forEach(report => {

        const card =
            document.createElement("div");

        card.className = "report-card";


        card.innerHTML = `

            <div class="report-info">

                <h3>
                    ${report.category}
                </h3>

                <p>
                    📍 ${report.location}
                </p>

                <p>
                    ${report.description}
                </p>

                <p>
                    Reported:
                    ${report.date}
                </p>

                <div class="report-meta">

                    <span class="tag ${getPriorityClass(report.priority)}">
                        ${report.priority} Priority
                    </span>

                    <span class="tag ${getStatusClass(report.status)}">
                        ${report.status}
                    </span>

                </div>

            </div>


            <div>
<button
    class="primary-btn"
    onclick="changeStatus(${report.id})">

    Update Status

</button>

<button
    class="delete-btn"
    onclick="deleteReport(${report.id})">

    Delete

</button>

            </div>

        `;

        list.appendChild(card);

    });

}


function getPriorityClass(priority) {

    if (priority === "High") {
        return "high";
    }

    if (priority === "Medium") {
        return "medium";
    }

    return "low";

}


function getStatusClass(status) {

    if (status === "Resolved") {
        return "resolved";
    }

    if (status === "In Progress") {
        return "inprogress";
    }

    return "pending";

}


function changeStatus(id) {

    const report =
        reports.find(
            item => item.id === id
        );

    if (!report) {
        return;
    }

    if (report.status === "Pending") {

        report.status = "In Progress";

    }

    else if (report.status === "In Progress") {

        report.status = "Resolved";

    }

    else {

        report.status = "Pending";

    }

    saveReports();

    displayReports();

    updateDashboard();

}
function deleteReport(id) {

    const report = reports.find(
        item => item.id === id
    );

    if (!report) {
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) {
        return;
    }

    reports = reports.filter(
        item => item.id !== id
    );

    saveReports();

    displayReports();

    updateDashboard();

}


function updateDashboard() {

    const total =
        reports.length;

    const pending =
        reports.filter(
            r => r.status === "Pending"
        ).length;

    const high =
        reports.filter(
            r =>
                r.priority === "High" &&
                r.status !== "Resolved"
        ).length;

    const resolved =
        reports.filter(
            r => r.status === "Resolved"
        ).length;

    document
        .getElementById("totalReports")
        .textContent = total;

    document
        .getElementById("pendingReports")
        .textContent = pending;

    document
        .getElementById("highReports")
        .textContent = high;

    document
        .getElementById("resolvedReports")
        .textContent = resolved;


    let score = 100;

    reports.forEach(report => {

        if (report.status !== "Resolved") {

            if (report.priority === "High") {
                score -= 10;
            }

            else if (report.priority === "Medium") {
                score -= 5;
            }

            else {
                score -= 2;
            }

        }

    });


    score = Math.max(0, score);


    document
        .getElementById("healthScore")
        .textContent =
        score + "%";

}


saveReports();

displayReports();

updateDashboard();
