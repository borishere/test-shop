(function($) {
    $.fn.rotate = function(options) {
        return $(this).each(function() {
            let $this = $(this);
            let clickPosition = null;
            let currentIndex = 0;
            let images = [];
            let image = null;
            let isIE = window.navigator.userAgent.match(/(MSIE|Trident)/);

            for (let i = 0; i < options.count; i++) {
                let img = new Image();

                img.src = options.source + i + options.ext;
                images.push(img);
            }

            let moveHandler = function(e) {
                let clientX = e.clientX || e.touches[0].clientX;
                let offset = clientX - clickPosition;

                if (Math.abs(offset) > options.speed) {
                    clickPosition = clientX;
                    currentIndex += offset / Math.abs(offset);

                    if (currentIndex >= options.count) currentIndex = 0;
                    if (currentIndex < 0) currentIndex = options.count - 1;

                    if (isIE) {
                        $this.css('background-image', `url('${images[currentIndex].src}')`);

                    } else {
                        image.attr('src', images[currentIndex].src);
                    }
                }
            };

            if (isIE) {
                $this
                    .css('background-image', `url('${options.source}${currentIndex}${options.ext}')`)
                    .on('mousemove', moveHandler);
            } else {
                $this
                    .append($('<img>').attr('src', options.source + currentIndex + options.ext))
                    .find('img')
                    .on('mousemove touchmove', moveHandler);

                image = $this.find('img');
            }
        });
    };

    $(function() {
        async function getShopItems() {
            let itemsUrl = 'https://borishere.github.io/shop/products.json';
            let response = await fetch(itemsUrl);
            let result = await response.json();

            return result.items;
        }

        let $shopItems = $('.shop-items');

        $shopItems.find('.item').eq(0).find('.item__img-rotate').rotate({
            'source': 'assets/images/notebook/3d/',
            'ext': '.jpg',
            'count': 36,
            'speed': 6
        });
        $shopItems.find('.item').eq(1).find('.item__img-rotate').rotate({
            'source': 'assets/images/notebook2/3d/',
            'ext': '.jpg',
            'count': 36,
            'speed': 6
        });
        $shopItems.find('.item').eq(2).find('.item__img-rotate').rotate({
            'source': 'assets/images/notebook3/3d/',
            'ext': '.jpg',
            'count': 36,
            'speed': 6
        });
        $shopItems.find('.item').eq(3).find('.item__img-rotate').rotate({
            'source': 'assets/images/notebook4/3d/',
            'ext': '.jpg',
            'count': 35,
            'speed': 6
        });
        $shopItems.find('.item').eq(4).find('.item__img-rotate').rotate({
            'source': 'assets/images/washing-machine/3d/',
            'ext': '.jpg',
            'count': 19,
            'speed': 12
        });
        $shopItems.find('.item').eq(5).find('.item__img-rotate').rotate({
            'source': 'assets/images/dryer/3d/',
            'ext': '.jpg',
            'count': 20,
            'speed': 12
        });

        let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        let updateModal = ($modal, curItem) => {
            let imagesHtml = '';

            curItem.images.forEach(image => {
                imagesHtml += `<img src="${image}">`;
            });

            $modal.find('.info-modal__slider')
                .slick('unslick')
                .html(imagesHtml)
                .slick({
                    nextArrow: '<span class="shop-icon-angle-right slick-next-btn"></span>',
                    prevArrow: '<span class="shop-icon-angle-left slick-prev-btn"></span>'
                });

            $modal.find('.info-modal__name').text(curItem.name);
            $modal.find('.info-modal__price').text(curItem.price);
            $modal.find('.info-modal-description').text(curItem.description);
            $modal.find('.shop-form__status').hide();
        };

        let checkModalBtns = ($modal, $curEl) => {
            $modal.find('.item-next-btn').show();
            $modal.find('.item-prev-btn').show();

            if ($curEl.is(':first-child')) {
                $modal.find('.item-prev-btn').hide();
            } else if ($curEl.is(':last-child')) {
                $modal.find('.item-next-btn').hide();
            }
        };

        $shopItems.find('.item .item__button').on('click', function(e) {
            e.stopPropagation();
        });

        $shopItems.find('.item').on('click', function() {
            getShopItems()
                .then(items => {
                    let $itemEl = $(this);
                    let currentId = $itemEl.data('id');
                    let item;

                    for (let i = 0; i < items.length; i++) {
                        const el = items[i];

                        if (parseInt(el.id) === currentId) {
                            item = el;

                            break;
                        }
                    }

                    if (!item) {
                        return;
                    }

                    let imagesHtml = '';

                    item.images.forEach(image => {
                        imagesHtml += `<img src="${image}">`;
                    });

                    $shopItems.find('.item').removeClass('active');
                    $itemEl.addClass('active');

                    let $modal = $(`
                        <div class="info-modal">
                            <div class="container info-modal__body">
                                <span class="shop-icon-close info-modal__close-btn"></span>
                                <div class="row">
                                    <div class="col-md-6 info-modal__slider">
                                    ${imagesHtml}
                                    </div>
                                    <div class="col-md-6 info-modal__content">
                                        <h4 class="info-modal__name">${item.name}</h4>
                                        <p class="info-modal__price">${item.price}</p>
                                        <p class="info-modal-description">${item.description}</p>
                                        <div class="container form-section">
                                            <h3 class="form-title">Заполните форму</h3>
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <form action="https://formspree.io/meqrylrp" method="POST" class="shop-form">
                                                        <div class="loader">
                                                            <div class="loader-inner"></div>
                                                        </div>
                                                        <p class="shop-form__status"></p>
                                                        <div class="row">
                                                            <div class="col-lg-4 col-md-12 col-sm-12">
                                                                <input type="text" name="Имя" placeholder="Имя" class="shop-form__input">
                                                            </div>
                                                            <div class="col-lg-4 col-md-12 col-sm-12">
                                                                <input type="tel" name="Телефон" placeholder="Телефон" class="shop-form__input" pattern="[0-9]{5,}" required>
                                                            </div>
                                                            <div class="col-lg-4 col-md-12 col-sm-12">
                                                                <button type="submit" class="shop-form__btn">Заказать</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span class="shop-icon-arrow-circle-o-right item-next-btn"></span>
                                <span class="shop-icon-arrow-circle-o-left item-prev-btn"></span>
                            </div>
                       </div>`
                    );

                    let $form = $modal.find('.shop-form');
                    let $status = $form.find('.shop-form__status');
                    let $loader = $form.find('.loader');

                    let successHandler = () => {
                        $status.addClass('form-success')
                            .removeClass('form-fail')
                            .text('Спасибо за заявку!')
                            .show();

                        $form[0].reset();

                        $loader.removeClass('show');
                    };

                    let failHandler = () => {
                        $status
                            .addClass('form-fail')
                            .removeClass('form-success')
                            .text('Ошибка! Попробуйте ещё раз')
                            .show();

                        $loader.removeClass('show');
                    };

                    $form.on('submit', function(e) {
                        e.preventDefault();

                        $loader.addClass('show');

                        let data = new FormData($form[0]);

                        sendData($form[0].method, $form[0].action, data)
                            .then(result => {
                                if (result && result.ok) {
                                    successHandler();
                                } else {
                                    failHandler();
                                }
                            }).catch(e => {
                                console.error(e);
                                failHandler();
                            });
                    });

                    async function sendData(method, url, data) {
                        let response;
                        let result;

                        try {
                            response = await fetch(url, {
                                method: method,
                                headers: {
                                    'Accept': 'application/json'
                                },
                                body: data
                            });

                            if (response) {
                                result = await response.json();

                                return result;
                            }
                        } catch (e) {
                            throw e;
                        }
                    }

                    $modal.find('.info-modal__slider')
                        .slick({
                            nextArrow: '<span class="shop-icon-angle-right slick-next-btn"></span>',
                            prevArrow: '<span class="shop-icon-angle-left slick-prev-btn"></span>'
                        });

                    $modal.find('.info-modal__close-btn').addBack().on('click', function() {
                        $modal.fadeOut(400, function() {
                            $modal.remove();
                        $('body').removeClass('info-modal-opened').css('padding-right', '');
                        });
                    });

                    $modal.find('.info-modal__body').on('click', function(e) {
                        e.stopPropagation();
                    });

                    $modal.find('.item-next-btn').on('click', function() {
                        getShopItems()
                            .then(items => {
                                let $activeEl = $shopItems.find('.item.active');
                                let $nextEl = $activeEl.parent().next().find('.item');

                                if (!$nextEl.length) {
                                    return;
                                }

                                $activeEl.removeClass('active');
                                $nextEl.addClass('active');

                                let $nextElId = $nextEl.data('id');
                                let item;

                                for (let i = 0; i < items.length; i++) {
                                    const el = items[i];

                                    if (parseInt(el.id) === $nextElId) {
                                        item = el;

                                        break;
                                    }
                                }

                                updateModal($modal, item);
                                checkModalBtns($modal, $nextEl.parent());
                            }).catch(e => {
                                console.error(e);
                            });
                    });

                    $modal.find('.item-prev-btn').on('click', function() {
                        getShopItems()
                            .then(items => {
                                let $activeEl = $shopItems.find('.item.active');
                                let $prevEl = $activeEl.parent().prev().find('.item');

                                if (!$prevEl.length) {
                                    return;
                                }

                                $activeEl.removeClass('active');
                                $prevEl.addClass('active');

                                let $prevElId = $prevEl.data('id');
                                let item;

                                for (let i = 0; i < items.length; i++) {
                                    const el = items[i];

                                    if (parseInt(el.id) === $prevElId) {
                                        item = el;

                                        break;
                                    }
                                }

                                updateModal($modal, item);
                                checkModalBtns($modal, $prevEl.parent());
                            }).catch(e => {
                                console.error(e);
                            });
                    });

                    $('body').append($modal).addClass('info-modal-opened');

                    if (!isMobile) {
                        $('body').css('padding-right', '17px');
                    }

                    setTimeout(() => {
                        $modal.addClass('animated');
                    }, 0);

                    checkModalBtns($modal, $itemEl.parent());
                })
                .catch(e => {
                    console.error(e);
                });
        });
    });
})(jQuery);