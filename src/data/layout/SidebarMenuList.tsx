import { SidebarMenuType } from "@/types/layout";

export const menuList: SidebarMenuType[] = [
  {
    title: "- General",
    menu: [
      {
        id: 1,
        title: "Dashboard",
        icon: "home",
        badge: true,
        badgeName: "3",
        badgeColor: "light-primary",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Default",
            type: "link",
            url: `/dashboard/default`,
          },
          {
            title: "Ecommerce",
            type: "link",
            url: `/dashboard/ecommerce`,
          },
          {
            title: "Project",
            type: "link",
            url: `/dashboard/project`,
          },
        ],
      },
      {
        id: 2,
        title: "Widgets",
        icon: "widget",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "General",
            type: "link",
            url: `/widgets/general-widget`,
          },
          {
            title: "Chart",
            type: "link",
            url: `/widgets/chart-widget`,
          },
        ],
      },
    ],
  },
  {
    title: "- Applications",
    menu: [
      {
        id: 3,
        title: "Project",
        type: "sub",
        icon: "project",
        badge: true,
        badgeName: "New",
        badgeColor: "light-secondary",
        active: false,
        subMenu: [
          {
            title: "Project List",
            type: "link",
            url: `/applications/project/project-list`,
          },
          {
            title: "Create New",
            type: "link",
            url: `/applications/project/create-project`,
          },
        ],
      },
      {
        id: 4,
        title: "File Manager",
        url: `/applications/file-manager`,
        icon: "file",
        type: "link",
      },
      {
        id: 5,
        title: "Ecommerce",
        icon: "ecommerce",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Add Products",
            type: "link",
            url: `/applications/ecommerce/add-products`,
          },
          {
            title: "Product",
            type: "link",
            url: `/applications/ecommerce/product`,
          },
          {
            title: "Category Page",
            type: "link",
            url: `/applications/ecommerce/category-page`,
          },
          {
            title: "Product Page",
            type: "link",
            url: `/applications/ecommerce/product-page`,
          },
          {
            title: "Product list",
            type: "link",
            url: `/applications/ecommerce/product-list`,
          },
          {
            title: "Payment Details",
            type: "link",
            url: `/applications/ecommerce/payment-details`,
          },
          {
            title: "Order History",
            type: "link",
            url: `/applications/ecommerce/order-history`,
          },
          {
            title: "Invoices",
            type: "sub",
            subMenu: [
              {
                title: "Invoice-1",
                type: "link",
                url: `/applications/ecommerce/invoice/invoice-1`,
              },
              {
                title: "Invoice-2",
                type: "link",
                url: `/applications/ecommerce/invoice/invoice-2`,
              },
              {
                title: "Invoice-3",
                type: "link",
                url: `/applications/ecommerce/invoice/invoice-3`,
              },
              {
                title: "Invoice-4",
                type: "link",
                url: `/applications/ecommerce/invoice/invoice-4`,
              },
              {
                title: "Invoice-5",
                type: "link",
                url: `/applications/ecommerce/invoice/invoice-5`,
              },
              {
                title: "Invoice-6",
                type: "link",
                url: `/applications/ecommerce/invoice/invoice-6`,
              },
            ],
          },
          {
            title: "Cart",
            type: "link",
            url: `/applications/ecommerce/cart`,
          },
          {
            title: "Wishlist",
            type: "link",
            url: `/applications/ecommerce/wishlist`,
          },
          {
            title: "Checkout",
            type: "link",
            url: `/applications/ecommerce/checkout`,
          },
          {
            title: "Pricing",
            type: "link",
            url: `/applications/ecommerce/pricing`,
          },
        ],
      },
      {
        id: 6,
        title: "Letter Box",
        url: `/applications/letter-box`,
        icon: "email",
        type: "link",
      },
      {
        id: 7,
        title: "Chats",
        icon: "chat",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Private Chat",
            type: "link",
            url: `/applications/chat/chat_private`,
          },
          {
            title: "Group chat",
            type: "link",
            url: `/applications/chat/chat_group`,
          },
        ],
      },
      {
        id: 8,
        title: "Users",
        icon: "user",
        type: "sub",
        bookmark: true,
        active: false,
        subMenu: [
          {
            title: "Users Profile",
            type: "link",
            url: `/applications/users/user-profile`,
          },
          {
            title: "Users Edit",
            type: "link",
            url: `/applications/users/edit-profile`,
          },
          {
            title: "Users Cards",
            type: "link",
            url: `/applications/users/user-cards`,
          },
        ],
      },
      {
        id: 9,
        title: "Bookmarks",
        url: `/applications/bookmark`,
        bookmark: true,
        type: "link",
        icon: "bookmark",
      },
      {
        id: 10,
        title: "Contacts",
        icon: "contact",
        url: `/applications/contacts`,
        type: "link",
      },
      {
        id: 11,
        title: "Tasks",
        url: `/applications/task`,
        icon: "task",
        type: "link",
      },
      {
        id: 12,
        title: "Calendar",
        url: `/applications/calendar`,
        icon: "calendar",
        type: "link",
      },
      {
        id: 13,
        title: "Social App",
        url: `/applications/socialapp`,
        bookmark: true,
        icon: "social",
        type: "link",
      },
      {
        id: 14,
        title: "To-Do",
        url: `/applications/todo`,
        bookmark: true,
        icon: "to-do",
        type: "link",
      },
      {
        id: 15,
        title: "Search Result",
        url: `/applications/search`,
        icon: "search",
        type: "link",
      },
    ],
  },
  {
    title: "- Forms & Table",
    menu: [
      {
        id: 16,
        title: "Forms",
        icon: "form",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Form Controls",
            type: "sub",
            subMenu: [
              {
                title: "Form Validation",
                type: "link",
                url: `/forms/form-controls/form-validation`,
              },
              {
                title: "Base Inputs",
                type: "link",
                url: `/forms/form-controls/base-input`,
              },
              {
                title: "Checkbox & Radio",
                type: "link",
                url: `/forms/form-controls/radio-checkbox-control`,
              },
              {
                title: "Input Groups",
                type: "link",
                url: `/forms/form-controls/input-group`,
              },
              {
                title: "Input Mask",
                type: "link",
                url: `/forms/form-controls/input-mask`,
              },
              {
                title: "Mega Options",
                type: "link",
                url: `/forms/form-controls/mega-options`,
              },
            ],
          },
          {
            title: "Form Widgets",
            type: "sub",
            subMenu: [
              {
                title: "Datepicker",
                type: "link",
                url: `/forms/form-widgets/datepicker`,
              },
              {
                title: "Touchspin",
                type: "link",
                url: `/forms/form-widgets/touchspin`,
              },
              {
                title: "Switch",
                type: "link",
                url: `/forms/form-widgets/switch`,
              },
              {
                title: "Typeahead",
                type: "link",
                url: `/forms/form-widgets/typeahead`,
              },
              {
                title: "Clipboard",
                type: "link",
                url: `/forms/form-widgets/clipboard`,
              },
            ],
          },
          {
            title: "Form Layout",
            type: "sub",
            subMenu: [
              {
                title: "Form Wizard 1",
                type: "link",
                url: `/forms/form-layout/form-wizard-1`,
              },
              {
                title: "Form Wizard 2",
                type: "link",
                url: `/forms/form-layout/form-wizard-2`,
              },
              {
                title: "Two Factor",
                type: "link",
                url: `/forms/form-layout/two-factor`,
              },
            ],
          },
        ],
      },
      {
        id: 17,
        title: "Tables",
        icon: "table",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Reactstrap Tables",
            type: "sub",
            subMenu: [
              {
                title: "Basic Tables",
                type: "link",
                url: `/table/reactstrap-tables/basic-table`,
              },
              {
                title: "Table Components",
                type: "link",
                url: `/table/reactstrap-tables/table-components`,
              },
            ],
          },
          {
            title: "Data Tables",
            type: "sub",
            subMenu: [
              {
                title: "Basic Init",
                type: "link",
                url: `/table/data-tables/basic-init`,
              },
              {
                title: "Advance Init",
                type: "link",
                url: `/table/data-tables/advance-init`,
              },
              {
                title: "API",
                type: "link",
                url: `/table/data-tables/api`,
              },
              {
                title: "Data Sources",
                type: "link",
                url: `/table/data-tables/data-sources`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "- Components",
    menu: [
      {
        id: 18,
        title: "Ui Kits",
        icon: "ui-kits",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Typography",
            type: "link",
            url: `/components/ui-kits/typography`,
          },
          {
            title: "Avatars",
            type: "link",
            url: `/components/ui-kits/avatars`,
          },
          {
            title: "Helper Classes",
            type: "link",
            url: `/components/ui-kits/helper-classes`,
          },
          {
            title: "Grid",
            type: "link",
            url: `/components/ui-kits/grid`,
          },
          {
            title: "Tag & pills",
            type: "link",
            url: `/components/ui-kits/tag-pills`,
          },
          {
            title: "Progress",
            type: "link",
            url: `/components/ui-kits/progress-bar`,
          },
          {
            title: "Modal",
            type: "link",
            url: `/components/ui-kits/modal`,
          },
          {
            title: "Alert",
            type: "link",
            url: `/components/ui-kits/alert`,
          },
          {
            title: "Popover",
            type: "link",
            url: `/components/ui-kits/popover`,
          },
          {
            title: "Tooltip",
            type: "link",
            url: `/components/ui-kits/tooltip`,
          },
          {
            title: "Dropdown",
            type: "link",
            url: `/components/ui-kits/dropdown`,
          },
          {
            title: "Accordion",
            type: "link",
            url: `/components/ui-kits/accordion`,
          },
          {
            title: "Tabs",
            type: "link",
            url: `/components/ui-kits/tabs`,
          },
          {
            title: "Lists",
            type: "link",
            url: `/components/ui-kits/lists`,
          },
        ],
      },
      {
        id: 19,
        title: "Bonus Ui",
        icon: "bonus-kit",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Scrollable",
            type: "link",
            url: `/components/bonus-ui/scrollable`,
          },
          {
            title: "Tree View",
            type: "link",
            url: `/components/bonus-ui/tree`,
          },
          {
            title: "Toasts",
            type: "link",
            url: `/components/bonus-ui/toasts`,
          },
          {
            title: "Rating",
            type: "link",
            url: `/components/bonus-ui/rating`,
          },
          {
            title: "Dropzone",
            type: "link",
            url: `/components/bonus-ui/dropzone`,
          },
          {
            title: "Tour",
            type: "link",
            url: `/components/bonus-ui/tour`,
          },
          {
            title: "SweetAlert2",
            type: "link",
            url: `/components/bonus-ui/sweet-alert-2`,
          },
          {
            title: "Carousel",
            type: "link",
            url: `/components/bonus-ui/carousel`,
          },
          {
            title: "Ribbons",
            type: "link",
            url: `/components/bonus-ui/ribbons`,
          },
          {
            title: "Pagination",
            type: "link",
            url: `/components/bonus-ui/pagination`,
          },
          {
            title: "Breadcrumb",
            type: "link",
            url: `/components/bonus-ui/breadcrumb`,
          },
          {
            title: "Range Slider",
            type: "link",
            url: `/components/bonus-ui/range-slider`,
          },
          {
            title: "Image Cropper",
            type: "link",
            url: `/components/bonus-ui/image-cropper`,
          },
          {
            title: "Basic Card",
            type: "link",
            url: `/components/bonus-ui/basic-card`,
          },
          {
            title: "Creative Card",
            type: "link",
            url: `/components/bonus-ui/creative-card`,
          },
          {
            title: "Timeline",
            type: "link",
            url: `/components/bonus-ui/timeline`,
          },
        ],
      },
      {
        title: "Icons",
        icon: "icons",
        id: 20,
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Flag icon",
            type: "link",
            url: `/components/icons/flag-icon`,
          },
          {
            title: "Fontawesome Icon",
            type: "link",
            url: `/components/icons/font-awesome`,
          },
          {
            title: "Ico Icon",
            type: "link",
            url: `/components/icons/ico-icon`,
          },
          {
            title: "Themify Icon",
            type: "link",
            url: `/components/icons/themify-icon`,
          },
          {
            title: "Feather Icon",
            type: "link",
            url: `/components/icons/feather-icon`,
          },
          {
            title: "Whether Icon",
            type: "link",
            url: `/components/icons/weather-icon`,
          },
        ],
      },
      {
        id: 21,
        title: "Buttons",
        url: `/components/buttons`,
        icon: "button",
        type: "link",
      },
      {
        title: "Charts",
        icon: "charts",
        type: "sub",
        id: 22,
        active: false,
        subMenu: [
          {
            title: "Apex Chart",
            type: "link",
            url: `/components/charts/chart-apex`,
          },
          {
            title: "Google Chart",
            type: "link",
            url: `/components/charts/chart-google`,
          },
          {
            title: "Chartjs Chart",
            type: "link",
            url: `/components/charts/chartjs`,
          },
        ],
      },
    ],
  },
  {
    title: "- Pages",
    menu: [
      {
        id: 23,
        title: "Sample Page",
        url: `/pages/sample-page`,
        icon: "sample-page",
        type: "link",
      },
      {
        id: 24,
        title: "Others",
        icon: "others",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Error Page",
            type: "sub",
            subMenu: [
              {
                title: "Error 400",
                type: "link",
                url: `/others/errors/error400`,
              },
              {
                title: "Error 401",
                type: "link",
                url: `/others/errors/error401`,
              },
              {
                title: "Error 403",
                type: "link",
                url: `/others/errors/error403`,
              },
              {
                title: "Error 404",
                type: "link",
                url: `/others/errors/error404`,
              },
              {
                title: "Error 500",
                type: "link",
                url: `/others/errors/error500`,
              },
              {
                title: "Error 503",
                type: "link",
                url: `/others/errors/error503`,
              },
            ],
          },
          {
            title: "Authentication",
            type: "sub",
            subMenu: [
              {
                title: "Login Simple",
                type: "link",
                url: `/others/auth/login`,
              },
              {
                title: "Visual Login",
                type: "link",
                url: `/others/auth/login_bg_img`,
              },
              {
                title: "Visual Login 2",
                type: "link",
                url: `/others/auth/login_bg_img2`,
              },
              {
                title: "Validate Login",
                type: "link",
                url: `/others/auth/login_bs_validation`,
              },
              {
                title: "Tooltip Login",
                type: "link",
                url: `/others/auth/login_bs_tooltip`,
              },
              {
                title: "Alert Login",
                type: "link",
                url: `/others/auth/login_sa_validation`,
              },
              {
                title: "Register",
                type: "link",
                url: `/others/auth/sign_up`,
              },
              {
                title: "Register Image",
                type: "link",
                url: `/others/auth/sign_up_one`,
              },
              {
                title: "Visual Reg 2",
                type: "link",
                url: `/others/auth/sign_up_two`,
              },
              {
                title: "Reg Wizard",
                type: "link",
                url: `/others/auth/sign_up_wizard`,
              },
              {
                title: "Unlock User",
                type: "link",
                url: `/others/auth/unlock`,
              },
              {
                title: "Pwd Forget",
                type: "link",
                url: `/others/auth/forget_password`,
              },
              {
                title: "Pwd Reset",
                type: "link",
                url: `/others/auth/reset_password`,
              },
              {
                title: "Maintenance",
                type: "link",
                url: `/others/auth/maintenance`,
              },
            ],
          },
          {
            title: "Coming Soon",
            type: "sub",
            subMenu: [
              {
                title: "Coming Simple",
                type: "link",
                url: `/others/coming_soon/comingsoonsimple`,
              },
              {
                title: "Coming Bg Vid",
                type: "link",
                url: `/others/coming_soon/comingbgvideo`,
              },
              {
                title: "Coming Bg Img",
                type: "link",
                url: `/others/coming_soon/comingbgimg`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "- Miscellaneous",
    menu: [
      {
        id: 25,
        title: "Gallery",
        icon: "gallery",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Gallery Grid",
            type: "link",
            url: `/miscellaneous/gallery/grid_gallery`,
          },
          {
            title: "Gallery Grid Desc",
            type: "link",
            url: `/miscellaneous/gallery/grid_gallery_description`,
          },
          {
            title: "Masonry Gallery",
            type: "link",
            url: `/miscellaneous/gallery/masonry_gallery`,
          },
          {
            title: "Masonry With Desc",
            type: "link",
            url: `/miscellaneous/gallery/masonry_gallery_description`,
          },
          {
            title: "Hover Effects",
            type: "link",
            url: `/miscellaneous/gallery/gallery_hover`,
          },
        ],
      },
      {
        id: 26,
        title: "Blog",
        icon: "blog",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Blog Details",
            type: "link",
            url: `/miscellaneous/blog/blog-detail`,
          },
          {
            title: "Blog Single",
            type: "link",
            url: `/miscellaneous/blog/blog-single`,
          },
          {
            title: "Add Post",
            type: "link",
            url: `/miscellaneous/blog/add-post`,
          },
        ],
      },
      {
        id: 27,
        title: "FAQ",
        type: "link",
        icon: "faq",
        url: `/miscellaneous/faq`,
      },
      {
        id: 28,
        title: "Job Search",
        icon: "job-search",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Cards view",
            type: "link",
            url: `/miscellaneous/job-search/job-cards-view`,
          },
          {
            title: "List View",
            type: "link",
            url: `/miscellaneous/job-search/job-list-view`,
          },
          {
            title: "Job Details",
            type: "link",
            url: `/miscellaneous/job-search/job-details`,
          },
          {
            title: "Apply",
            type: "link",
            url: `/miscellaneous/job-search/job-apply`,
          },
        ],
      },
      {
        id: 29,
        title: "Learning",
        icon: "learning",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Learning List",
            type: "link",
            url: `/miscellaneous/learning/learning-list-view`,
          },
          {
            title: "Detailed Course",
            type: "link",
            url: `/miscellaneous/learning/course-details`,
          },
        ],
      },
      {
        id: 30,
        title: "Maps",
        icon: "maps",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "Google Maps",
            type: "link",
            url: `/miscellaneous/maps/google-map`,
          },
          {
            title: "Leaflet Maps",
            type: "link",
            url: `/miscellaneous/maps/leaflet-map`,
          },
        ],
      },
      {
        id: 31,
        title: "Editors",
        icon: "editors",
        type: "sub",
        active: false,
        subMenu: [
          {
            title: "CK Editor",
            type: "link",
            url: `/miscellaneous/editors/ck-editor`,
          },
          {
            title: "ACE Code Editor",
            type: "link",
            url: `/miscellaneous/editors/ace-code-editor`,
          },
        ],
      },
      {
        id: 32,
        title: "Knowledgebase",
        icon: "knowledgebase",
        type: "link",
        active: false,
        url: `/miscellaneous/knowledgebase`,
      },
      {
        id: 33,
        title: "Support Ticket",
        icon: "support-tickets",
        type: "link",
        active: false,
        url: `/miscellaneous/support-ticket`,
      },
    ],
  },
];
