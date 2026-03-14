document.addEventListener('DOMContentLoaded', async () => {
    const blogList = document.getElementById('blog-list');
    const postContainer = document.getElementById('post-content');
    const searchInput = document.getElementById('blog-search');
    const tagsContainer = document.getElementById('filter-tags');
    
    let allPosts = [];
    let activeTag = 'All';

    // Fetch Data
    allPosts = await Utils.fetchData('data/blog.json');

    // Route handling
    const params = Utils.getQueryParams();
    if (params.id && postContainer) {
        renderFullPost(params.id);
    } else if (blogList) {
        if (allPosts) {
            renderBlogList(allPosts);
            renderTags(allPosts);
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', filterAndRender);
        }
    }

    function renderBlogList(posts) {
        blogList.innerHTML = posts.map(post => `
            <article class="blog-card glass reveal active">
                ${post.image ? `<div class="blog-thumb" style="background-image: url('${post.image}')"></div>` : ''}
                <div class="blog-info">
                    <div class="blog-meta">
                        <span class="date">${Utils.formatDate(post.date)}</span>
                        <span class="read-time">${Utils.calculateReadingTime(post.content)}</span>
                    </div>
                    <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
                    <p>${post.summary}</p>
                    <div class="blog-tags">
                        ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
    }

    function renderFullPost(postId) {
        const post = allPosts.find(p => p.id === postId);
        if (!post) {
            postContainer.innerHTML = "<h1>Post not found</h1>";
            return;
        }

        document.title = `${post.title} | Portfolio Blog`;
        postContainer.innerHTML = `
            <div class="post-header">
                <a href="blog.html" class="back-link">← Back to Blog</a>
                <div class="post-meta">
                    <span>${Utils.formatDate(post.date)}</span> • 
                    <span>${Utils.calculateReadingTime(post.content)}</span>
                </div>
                <h1>${post.title}</h1>
                <div class="post-tags">
                    ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-hero">` : ''}
            </div>
            <div class="post-body">
                ${post.content}
            </div>
        `;
    }

    function renderTags(posts) {
        if (!tagsContainer) return;
        const tags = new Set(['All']);
        posts.forEach(p => p.tags.forEach(t => tags.add(t)));
        
        tagsContainer.innerHTML = Array.from(tags).map(tag => `
            <button class="tag-btn ${tag === activeTag ? 'active' : ''}" data-tag="${tag}">${tag}</button>
        `).join('');

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
        const query = (searchInput?.value || "").toLowerCase();
        const filtered = allPosts.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(query) || 
                                 p.summary.toLowerCase().includes(query) ||
                                 p.tags.some(t => t.toLowerCase().includes(query));
            const matchesTag = activeTag === 'All' || p.tags.includes(activeTag);
            return matchesSearch && matchesTag;
        });
        renderBlogList(filtered);
    }
});
