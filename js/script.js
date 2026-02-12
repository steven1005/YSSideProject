function scrollToSection(sectionId) {
    const iframeWin = $('#content-frame')[0].contentWindow;
    const section = $(iframeWin.document).find('#' + sectionId);
    if (section.length) {
        section[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function loadCourse(coursePath, courseName) {
    const iframe = $('#content-frame');
    const sidebarNav = $('#sidebar-nav-list');
    const sidebarTitle = $('#sidebar-title');

    sidebarTitle.text(courseName);
    sidebarNav.empty().append('<li class="nav-item"><span class="nav-link text-muted">載入中...</span></li>');

    iframe.off('load');
    iframe.attr('src', coursePath);

    iframe.on('load', function () {
        try {
            sidebarNav.empty();
            const iframeDoc = this.contentWindow.document;

            $(iframeDoc.body).css({
                'background-color': '#212529',
                'color': 'white',
                'margin': 0,
                'padding': '1.5rem'
            });

            $(this.contentWindow).on('scroll', function () {
                if ($(this).scrollTop() > 100) {
                    $('#back-to-top-btn').fadeIn();
                } else {
                    $('#back-to-top-btn').fadeOut();
                }
            });

            const headings = $(iframeDoc).find('h1.SideTabs');

            if (headings.length === 0) {
                sidebarNav.html('<li class="nav-item"><span class="nav-link text-muted">此頁面無章節</span></li>');
                return;
            }

            headings.each(function (index) {
                const heading = $(this);
                const text = heading.text();
                let id = heading.attr('id');

                if (!id) {
                    id = 'section-' + index;
                    heading.attr('id', id);
                }

                const listItem = $('<li>').addClass('nav-item');
                const link = $('<a>').addClass('nav-link text-white').attr('href', '#').text(text);

                link.on('click', function (e) {
                    e.preventDefault();
                    scrollToSection(id);
                    sidebarNav.find('a').removeClass('active');
                    $(this).addClass('active');
                });

                listItem.append(link);
                sidebarNav.append(listItem);
            });
        } catch (e) {
            sidebarNav.html('<li class="nav-item"><span class="nav-link text-danger">無法讀取課程內容</span></li>');
            console.error('Error accessing iframe content:', e);
        }
    });
}

$(document).ready(function () {
    const sidebarEl = document.getElementById('sidebar');
    const mainWrapperEl = document.getElementById('main-wrapper');

    sidebarEl.addEventListener('hidden.bs.collapse', event => {
        mainWrapperEl.style.marginLeft = '0';
    });

    sidebarEl.addEventListener('shown.bs.collapse', event => {
        mainWrapperEl.style.marginLeft = '280px';
    });

    loadCourse('HtmlCSSBootstrap/index.html', 'HtmlCSSBootstrap');
});
