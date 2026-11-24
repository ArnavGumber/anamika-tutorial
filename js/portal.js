(function () {
  "use strict";

  // Add verified updates here. Leave arrays empty until institute information is confirmed.
  const announcements = [];
  const timetableRows = [];

  const announcementList = document.getElementById("announcement-list");
  if (announcements.length) {
    announcementList.innerHTML = announcements.map(function (item) {
      return `
        <article class="announcement-card">
          <time class="announcement-date" datetime="${item.isoDate}">
            <strong>${item.day}</strong>
            <span>${item.month}</span>
          </time>
          <div>
            <h3>${item.title}</h3>
            <p>${item.message}</p>
          </div>
        </article>`;
    }).join("");
  } else {
    announcementList.innerHTML = `
      <div class="announcement-empty">
        <div>
          <p class="section-label">Updates</p>
          <h3>No new announcements</h3>
          <p>Check back here for verified notices, academic updates and important institute information.</p>
        </div>
      </div>`;
  }

  const timetableContent = document.getElementById("timetable-content");
  if (timetableRows.length) {
    timetableContent.innerHTML = `
      <div class="timetable-card">
        <table>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Time</th>
              <th scope="col">Class / Batch</th>
              <th scope="col">Subject</th>
            </tr>
          </thead>
          <tbody>
            ${timetableRows.map(function (row) {
              return `<tr><td>${row.day}</td><td>${row.time}</td><td>${row.batch}</td><td>${row.subject}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
  } else {
    timetableContent.innerHTML = `
      <div class="timetable-empty">
        <div>
          <p class="section-label">Schedule</p>
          <h3>Timetable updates coming soon</h3>
          <p>Batch timings and schedules have not been published. Please contact the institute to confirm current classes.</p>
        </div>
      </div>`;
  }

  const now = new Date();
  document.getElementById("portal-date").textContent = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);
  document.getElementById("portal-year").textContent = now.getFullYear();

  document.getElementById("print-timetable").addEventListener("click", function () {
    window.print();
  });
})();
