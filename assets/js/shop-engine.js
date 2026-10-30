/**
 * Bookworm - Category Shop Engine
 * Supports filtering, sorting, pagination counts, search, and reactive URL query sync
 * for Syllabus Books, School Uniforms, and Stationery departments.
 */

window.$ = window.jQuery || window.$;

var BOOKWORM_SHOP = {
    department: '',
    activeFilters: {},
    currentSort: 'menu_order',

    init: function(department) {
        this.department = department;
        this.parseUrlParams();
        this.bindEvents();
        this.updateSidebarCounts();
        this.render();
    },

    parseUrlParams: function() {
        var params = new URLSearchParams(window.location.search);
        this.activeFilters = {};

        // General search
        if (params.get('search')) this.activeFilters.search = params.get('search');

        // Department-specific filters
        if (params.get('class')) this.activeFilters.class = params.get('class');
        if (params.get('curriculum')) this.activeFilters.curriculum = params.get('curriculum');
        if (params.get('subject')) this.activeFilters.subject = params.get('subject');
        if (params.get('publisher')) this.activeFilters.publisher = params.get('publisher');

        if (params.get('gender')) this.activeFilters.gender = params.get('gender');
        if (params.get('type')) this.activeFilters.type = params.get('type');
        if (params.get('color')) this.activeFilters.color = params.get('color');

        if (params.get('category')) this.activeFilters.category = params.get('category');
        if (params.get('brand')) this.activeFilters.brand = params.get('brand');

        if (params.get('min_price')) this.activeFilters.min_price = parseInt(params.get('min_price'));
        if (params.get('max_price')) this.activeFilters.max_price = parseInt(params.get('max_price'));

        if (params.get('orderby')) {
            this.currentSort = params.get('orderby');
            $('#shop-orderby').val(this.currentSort);
        }
    },

    updateUrl: function() {
        var params = new URLSearchParams();
        for (var key in this.activeFilters) {
            if (this.activeFilters[key]) {
                params.set(key, this.activeFilters[key]);
            }
        }
        if (this.currentSort && this.currentSort !== 'menu_order') {
            params.set('orderby', this.currentSort);
        }

        var newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.pushState({ path: newUrl }, '', newUrl);
    },

    setFilter: function(key, val) {
        if (!val || this.activeFilters[key] === val) {
            delete this.activeFilters[key];
        } else {
            this.activeFilters[key] = val;
        }
        this.updateUrl();
        this.render();
    },

    clearAllFilters: function() {
        this.activeFilters = {};
        this.updateUrl();
        this.render();
    },

    bindEvents: function() {
        var self = this;

        // Sort change
        $('#shop-orderby').on('change', function() {
            self.currentSort = $(this).val();
            self.updateUrl();
            self.render();
        });

        // Filter clicks
        $(document).on('click', '[data-filter-key]', function(e) {
            e.preventDefault();
            var key = $(this).data('filter-key');
            var val = $(this).data('filter-val');
            self.setFilter(key, val);
        });

        // Clear filters button
        $(document).on('click', '.btn-clear-filters', function(e) {
            e.preventDefault();
            self.clearAllFilters();
        });

        // Popstate for browser back/forward buttons
        window.addEventListener('popstate', function() {
            self.parseUrlParams();
            self.render();
        });
    },

    getFilteredProducts: function() {
        var self = this;
        var prods = BOOKWORM_PRODUCTS.filter(function(p) {
            // Department filter
            if (self.department && p.department !== self.department) return false;

            // Search query
            if (self.activeFilters.search) {
                var q = self.activeFilters.search.toLowerCase();
                var text = (p.title + ' ' + (p.description || '') + ' ' + (p.subject || '') + ' ' + (p.publisher || '') + ' ' + (p.brand || '') + ' ' + (p.curriculum || '') + ' ' + (p.isbn || '') + ' ' + (p.sku || '')).toLowerCase();
                if (text.indexOf(q) === -1) return false;
            }

            // Category / Class / Type / Gender / Brand filters
            if (self.activeFilters.class) {
                var c = self.activeFilters.class.toLowerCase();
                var pc = (p.class || p.category || '').toLowerCase();
                if (pc.indexOf(c) === -1 && c.indexOf(pc) === -1) {
                    // Handle class groupings
                    if (c.indexOf('1–5') !== -1 || c.indexOf('1-5') !== -1) {
                        if (!/class\s+[1-5]\b/i.test(pc)) return false;
                    } else if (c.indexOf('6–8') !== -1 || c.indexOf('6-8') !== -1) {
                        if (!/class\s+[6-8]\b/i.test(pc)) return false;
                    } else if (c.indexOf('9–10') !== -1 || c.indexOf('9-10') !== -1) {
                        if (!/class\s+(9|10)\b/i.test(pc)) return false;
                    } else if (c.indexOf('11–12') !== -1 || c.indexOf('11-12') !== -1) {
                        if (!/class\s+(11|12)\b/i.test(pc)) return false;
                    } else {
                        return false;
                    }
                }
            }

            if (self.activeFilters.curriculum) {
                var curr = self.activeFilters.curriculum.toLowerCase();
                var pcurr = (p.curriculum || '').toLowerCase();
                if (curr.indexOf('o level') !== -1 && pcurr.indexOf('o-level') !== -1) {}
                else if (curr.indexOf('a level') !== -1 && pcurr.indexOf('a-level') !== -1) {}
                else if (curr.indexOf('oxford') !== -1 && pcurr.indexOf('oxford') !== -1) {}
                else if (curr.indexOf('pctb') !== -1 && (pcurr.indexOf('pctb') !== -1 || pcurr.indexOf('punjab') !== -1)) {}
                else if (curr.indexOf('fbise') !== -1 && (pcurr.indexOf('fbise') !== -1 || pcurr.indexOf('federal') !== -1)) {}
                else if (curr.indexOf('stb') !== -1 && (pcurr.indexOf('stb') !== -1 || pcurr.indexOf('sindh') !== -1)) {}
                else if (pcurr.indexOf(curr) === -1) return false;
            }

            if (self.activeFilters.subject) {
                if (!p.subject || p.subject.toLowerCase() !== self.activeFilters.subject.toLowerCase()) return false;
            }

            if (self.activeFilters.publisher) {
                if (!p.publisher || p.publisher.toLowerCase().indexOf(self.activeFilters.publisher.toLowerCase()) === -1) return false;
            }

            if (self.activeFilters.gender) {
                if (!p.gender || (p.gender.toLowerCase() !== self.activeFilters.gender.toLowerCase() && p.gender !== 'Unisex')) return false;
            }

            if (self.activeFilters.type) {
                var t = self.activeFilters.type.toLowerCase();
                var pt = (p.type || p.category || '').toLowerCase();
                if (pt.indexOf(t) === -1 && t.indexOf(pt) === -1) return false;
            }

            if (self.activeFilters.category) {
                var cat = self.activeFilters.category.toLowerCase();
                var pcat = (p.category || '').toLowerCase();
                if (pcat.indexOf(cat) === -1 && cat.indexOf(pcat) === -1) return false;
            }

            if (self.activeFilters.brand) {
                if (!p.brand || p.brand.toLowerCase() !== self.activeFilters.brand.toLowerCase()) return false;
            }

            // Price range
            if (self.activeFilters.min_price && p.price < self.activeFilters.min_price) return false;
            if (self.activeFilters.max_price && p.price > self.activeFilters.max_price) return false;

            return true;
        });

        // Sorting
        if (this.currentSort === 'price_asc') {
            prods.sort(function(a, b) { return a.price - b.price; });
        } else if (this.currentSort === 'price_desc') {
            prods.sort(function(a, b) { return b.price - a.price; });
        } else if (this.currentSort === 'rating') {
            prods.sort(function(a, b) { return (b.rating || 0) - (a.rating || 0); });
        } else if (this.currentSort === 'title') {
            prods.sort(function(a, b) { return a.title.localeCompare(b.title); });
        }

        return prods;
    },

    updateSidebarCounts: function() {
        var self = this;
        var deptProds = BOOKWORM_PRODUCTS.filter(function(p) {
            return !self.department || p.department === self.department;
        });

        $('[data-filter-key]').each(function() {
            var $item = $(this);
            var key = $item.data('filter-key');
            var val = $item.data('filter-val');
            var count = 0;

            deptProds.forEach(function(p) {
                if (key === 'gender') {
                    if (p.gender === val || p.gender === 'Unisex') count++;
                } else if (key === 'brand') {
                    if (p.brand && p.brand.toLowerCase() === val.toLowerCase()) count++;
                } else if (key === 'curriculum') {
                    var pc = (p.curriculum || '').toLowerCase();
                    var vc = val.toLowerCase();
                    if (vc.indexOf('o level') !== -1 && pc.indexOf('o-level') !== -1) count++;
                    else if (vc.indexOf('a level') !== -1 && pc.indexOf('a-level') !== -1) count++;
                    else if (pc.indexOf(vc) !== -1 || vc.indexOf(pc) !== -1) count++;
                } else if (key === 'class') {
                    var c = val.toLowerCase();
                    var pc = (p.class || p.category || '').toLowerCase();
                    if (c.indexOf('1–5') !== -1 || c.indexOf('1-5') !== -1) {
                        if (/class\s+[1-5]\b/i.test(pc)) count++;
                    } else if (c.indexOf('6–8') !== -1 || c.indexOf('6-8') !== -1) {
                        if (/class\s+[6-8]\b/i.test(pc)) count++;
                    } else if (c.indexOf('9–10') !== -1 || c.indexOf('9-10') !== -1) {
                        if (/class\s+(9|10)\b/i.test(pc)) count++;
                    } else if (c.indexOf('11–12') !== -1 || c.indexOf('11-12') !== -1) {
                        if (/class\s+(11|12)\b/i.test(pc)) count++;
                    } else if (pc.indexOf(c) !== -1 || c.indexOf(pc) !== -1) {
                        count++;
                    }
                } else if (key === 'subject') {
                    if (p.subject && p.subject.toLowerCase() === val.toLowerCase()) count++;
                } else if (key === 'type') {
                    var t = val.toLowerCase();
                    var pt = (p.type || p.category || '').toLowerCase();
                    if (pt.indexOf(t) !== -1 || t.indexOf(pt) !== -1) count++;
                } else if (key === 'category') {
                    var cat = val.toLowerCase();
                    var pcat = (p.category || '').toLowerCase();
                    if (pcat.indexOf(cat) !== -1 || cat.indexOf(pcat) !== -1) count++;
                }
            });

            var $countSpan = $item.find('.count');
            if ($countSpan.length) {
                $countSpan.text('(' + count + ')');
            }
        });
    },

    highlightActiveFilters: function() {
        var self = this;
        $('[data-filter-key]').removeClass('font-weight-bold text-primary active-filter');
        $('[data-filter-key]').find('i.fa-check').remove();

        for (var key in this.activeFilters) {
            var val = this.activeFilters[key];
            if (val) {
                var $active = $('[data-filter-key="' + key + '"][data-filter-val="' + val + '"]');
                $active.addClass('font-weight-bold text-primary active-filter');
                $active.prepend('<i class="fas fa-check font-size-1 mr-2 text-primary"></i>');
            }
        }

        // Active filters pill bar
        var $activeContainer = $('#active-filters-bar');
        if ($activeContainer.length) {
            var filterKeys = Object.keys(this.activeFilters).filter(function(k) { return self.activeFilters[k]; });
            if (filterKeys.length === 0) {
                $activeContainer.html('').hide();
            } else {
                var pillsHtml = '<div class="d-flex flex-wrap align-items-center mb-4"><span class="font-size-2 font-weight-medium mr-3">Active Filters:</span>';
                filterKeys.forEach(function(k) {
                    var label = self.activeFilters[k];
                    pillsHtml += '<a href="javascript:void(0);" data-filter-key="' + k + '" data-filter-val="' + label + '" class="badge badge-light border text-dark py-2 px-3 mr-2 mb-2 font-size-1 font-weight-normal">' + label + ' <i class="fas fa-times ml-1 text-danger"></i></a>';
                });
                pillsHtml += '<a href="javascript:void(0);" class="btn-clear-filters text-danger font-size-2 ml-2 mb-2 font-weight-medium">Clear All</a></div>';
                $activeContainer.html(pillsHtml).show();
            }
        }
    },

    render: function() {
        var products = this.getFilteredProducts();
        var $grid = $('#shop-products-grid');
        var $count = $('#result-count');

        // Update count
        if ($count.length) {
            if (products.length === 0) {
                $count.text('No products found matching your selection');
            } else {
                $count.text('Showing all ' + products.length + ' results');
            }
        }

        this.highlightActiveFilters();

        if (products.length === 0) {
            $grid.html('<li class="col-12 py-8 text-center"><div class="py-5"><i class="flaticon-reading font-size-10 text-gray-400 mb-3 d-block"></i><h4 class="font-size-4 mb-2">No items found</h4><p class="text-gray-700 font-size-2">Try clearing your filters or selecting a different category.</p><button class="btn btn-primary px-5 py-2 font-size-2 btn-clear-filters">Reset All Filters</button></div></li>');
            return;
        }

        var html = '';
        products.forEach(function(p) {
            var subTitle = p.publisher || p.brand || p.curriculum || '';
            var catTag = p.category || p.class || p.type || '';
            var oldPriceHtml = p.oldPrice ? '<del class="text-gray-500 font-size-1 mr-2"><span class="amount"><bdi><span class="currencySymbol">Rs.</span> ' + p.oldPrice.toLocaleString() + '</bdi></span></del>' : '';
            var badgeHtml = p.badge ? '<span class="badge badge-primary position-absolute top-0 right-0 m-3 z-index-2 font-size-1 py-1 px-2">' + p.badge + '</span>' : '';

            html += '<li class="add-to-wishlist-after_add_to_cart product type-product status-publish instock taxable shipping-taxable purchasable product-type-simple col border-right border-bottom">' +
                '<div class="bookworm-product-grid">' +
                    '<div class="product__inner overflow-hidden p-3 p-md-4d875">' +
                        badgeHtml +
                        '<div class="position-relative d-block">' +
                            '<div class="woocommerce-loop-product__header">' +
                                '<a href="product-detail.html?id=' + p.id + '" class="woocommerce-LoopProduct-link woocommerce-loop-product__link d-block text-center" style="height: 195px; display: flex; align-items: center; justify-content: center; background: #fafafa; border-radius: 4px; padding: 10px;">' +
                                    '<img src="' + p.image + '" class="img-fluid d-block mx-auto attachment-shop_catalog size-shop_catalog wp-post-image" style="max-height: 175px; width: auto; object-fit: contain;" alt="' + p.title + '">' +
                                '</a>' +
                            '</div>' +
                            '<div class="woocommerce-loop-product__body product__body pt-3 bg-white">' +
                                '<div class="woocommerce-loop-product__format text-uppercase font-size-1 mb-1 text-truncate text-primary">' +
                                    '<span>' + catTag + '</span>' +
                                '</div>' +
                                '<h2 class="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 crop-text-2 h-dark text-height-2" style="min-height: 40px;">' +
                                    '<a href="product-detail.html?id=' + p.id + '" class="woocommerce-LoopProduct-link woocommerce-loop-product__link" title="' + p.title + '">' + p.title + '</a>' +
                                '</h2>' +
                                '<div class="woocommerce-loop-product__author font-size-2 text-truncate mb-1">' +
                                    '<span class="text-gray-700">' + subTitle + '</span>' +
                                '</div>' +
                                (p.isbn ? '<div class="woocommerce-loop-product__isbn font-size-1 text-truncate mb-1"><span class="text-muted">ISBN:</span> <span class="font-weight-medium text-dark">' + p.isbn + '</span></div>' : '') +
                                '<span class="price d-block mb-1">' +
                                    oldPriceHtml +
                                    '<ins class="text-decoration-none mr-2">' +
                                        '<span class="woocommerce-Price-amount amount font-weight-medium font-size-3"><bdi><span class="woocommerce-Price-currencySymbol">Rs.</span> ' + p.price.toLocaleString() + '</bdi></span>' +
                                    '</ins>' +
                                '</span>' +
                            '</div>' +
                            '<div class="woocommerce-loop-product__hover product__hover d-flex align-items-center">' +
                                '<a href="javascript:void(0);" data-quantity="1" class="button product_type_simple add_to_cart_button ajax_add_to_cart text-uppercase text-dark h-dark font-weight-medium mr-auto" data-product_id="' + p.id + '" aria-label="Add to cart: ' + p.title + '">' +
                                    '<span class="product__add-to-cart">Add to cart</span>' +
                                    '<span class="product__add-to-cart-icon font-size-4"><i class="flaticon-icon-126515"></i></span>' +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</li>';
        });

        $grid.html(html);
    }
};
