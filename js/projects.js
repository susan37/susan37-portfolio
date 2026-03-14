document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.getElementById('projects-grid');
    const searchInput = document.getElementById('project-search');
    const tagsContainer = document.getElementById('filter-tags');
    
    let allProjects = [];
    let activeTag = 'All';

    // Fetch and Load Projects
    allProjects = await Utils.fetchData('data/projects.json');
    if (allProjects) {
        renderProjects(allProjects);
        renderTags(allProjects);
    }

    // Search events
    searchInput.addEventListener('input', (e) => {
        filterAndRender();
    });

    function renderProjects(projects) {
        projectsContainer.innerHTML = projects.map(project => `
            <div class="project-card glass reveal active" data-id="${project.id}">
                ${project.image ? `<div class="project-image" style="background-image: url('${project.image}')"></div>` : ''}
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span>${t}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.repo ? `<a href="${project.repo}" target="_blank" class="link-btn">Repo</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank" class="link-btn primary">Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderTags(projects) {
        const tags = new Set(['All']);
        projects.forEach(p => p.tags.forEach(t => tags.add(t)));
        
        tagsContainer.innerHTML = Array.from(tags).map(tag => `
            <button class="tag-btn ${tag === activeTag ? 'active' : ''}" data-tag="${tag}">${tag}</button>
        `).join('');

        // Tag click events
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeTag = btn.dataset.tag;
                document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterAndRender();
            });
        });
    }

    function filterAndRender() {
        const query = searchInput.value.toLowerCase();
        const filtered = allProjects.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(query) || 
                                 p.description.toLowerCase().includes(query) ||
                                 p.tech.some(t => t.toLowerCase().includes(query));
            const matchesTag = activeTag === 'All' || p.tags.includes(activeTag);
            return matchesSearch && matchesTag;
        });
        renderProjects(filtered);
    }
});
