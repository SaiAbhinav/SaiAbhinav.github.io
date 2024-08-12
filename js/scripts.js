function loadData() {
    const apiUrl = "./assets/data/data.json";

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);

            renderCount(data);
            renderExperience(data?.experiences || []);
            renderProjects(data?.projects || []);
            renderSkills(data?.skills || []);
            renderAchievements(data?.achievements || []);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function renderCount(data) {
    const counters = document.querySelectorAll(".stat-item span");

    const counts = {
        exps: calculateExperience(data.experiences),
        skills: calculateSkills(data.skills),
        projs: calculateProjects(data.projects),
        achs: calculateAchievements(data.achievements),
    };

    function calculateExperience(experiences) {
        let count = 0;
        experiences.forEach((experience) => {
            const startMonthNum = new Date(experience.startDate).getMonth();
            const endMonthNum = new Date(experience.endDate).getMonth();
            const startYearNum = new Date(experience.startDate).getFullYear();
            const endYearNum = new Date(experience.endDate).getFullYear();

            const totalMonths =
                (endYearNum - startYearNum) * 12 +
                (endMonthNum - startMonthNum) +
                1;

            count += totalMonths / 12;
        });
        return count;
    }

    function calculateSkills(skills) {
        let count = 0;
        skills.forEach((section) => {
            count += section.skills.length;
        });
        return count;
    }

    function calculateProjects(projects) {
        return projects.length || 0;
    }

    function calculateAchievements(achievements) {
        return achievements.length || 0;
    }

    counters.forEach((counter) => {
        counter.innerText = 0;
        let count = 0;
        function updateCount() {
            const target = parseInt(counts[counter.dataset.counter]);
            if (count < target) {
                count++;
                counter.innerText = count;
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        }

        updateCount();
    });
}

function renderExperience(experiences) {
    if ("content" in document.createElement("template")) {
        const experienceContainer = document.querySelector(".timeline");
        const experienceTemplate = document.getElementById(
            "experience-template"
        );

        experiences.forEach((experience, idx) => {
            const clone = experienceTemplate.content.cloneNode(true);

            clone.querySelector(".t-container").classList.add("right");
            clone.querySelector(".role").textContent = experience.role;
            clone.querySelector(".company").textContent = experience.company;
            clone.querySelector(
                ".time"
            ).textContent = `${experience.startDate} - ${experience.endDate}`;
            clone.querySelector(".summary").textContent = experience.summary;

            const technologies = clone.querySelector(".technologies");

            experience.technologies.forEach((tech) => {
                const li = document.createElement("li");
                li.classList.add("list-inline-item");
                li.classList.add("border-gradient");
                li.classList.add("p-2");
                li.textContent = tech;
                technologies.appendChild(li);
            });

            experienceContainer.appendChild(clone);
        });
    }
}

function renderProjects(projects) {
    console.log("Projects");

    if ("content" in document.createElement("template")) {
        const projectsContainer = document.querySelector(".projects-container");
        const projectTemplate = document.getElementById("project-template");

        projects.forEach((project, idx) => {
            const clone = projectTemplate.content.cloneNode(true);

            clone
                .querySelector(".project")
                .classList.add(idx % 2 == 0 ? "right" : "left");

            clone.querySelector(".project-title").textContent = project.title;
            clone.querySelector(".project-summary").textContent =
                project.summary;

            const technologies = clone.querySelector(".technologies");

            project.technologies.forEach((tech) => {
                const li = document.createElement("li");
                li.classList.add("list-inline-item");
                li.classList.add("border-gradient");
                li.classList.add("p-2");
                li.textContent = tech;
                technologies.appendChild(li);
            });

            projectsContainer.appendChild(clone);
        });
    }
}

function renderSkills(skills) {
    if ("content" in document.createElement("template")) {
        const skillsContainer = document.querySelector(".skills-container");
        const skillsTemplate = document.getElementById("skills-template");

        skills.forEach((section) => {
            const clone = skillsTemplate.content.cloneNode(true);

            clone.querySelector(".skills-section").textContent = section.title;

            const skillsList = clone.querySelector(".skills-list");

            section.skills.forEach((skill) => {
                const li = document.createElement("li");
                const div = document.createElement("div");
                const p = document.createElement("p");

                li.classList.add("list-inline-item", "p-2");
                div.classList.add("skill-icon", "border-gradient", "p-2");

                p.textContent = skill.name;

                if (skill.icon) {
                    const img = document.createElement("img");
                    img.src = `./assets/images/skills/${skill.icon}`;
                    div.appendChild(img);
                } else {
                    const text = document.createElement("p");
                    text.classList.add("m-0");
                    text.textContent = skill.name;
                    div.appendChild(text);
                }
                li.appendChild(div);
                li.appendChild(p);

                skillsList.appendChild(li);
            });

            skillsContainer.appendChild(clone);
        });
    }
}

function renderAchievements(achievements) {
    console.log("Achievements");
}

loadData();
