const ConfigDB = {
  settings: {
    layout_type: "ltr",
    layout_class: "compact-wrapper",
    sidebar: {
      type: "compact-wrapper",
      iconType: "stroke-svg",
    },
    sidebar_setting: "default-sidebar",
  },
  color: {
    primary_color: typeof window !== "undefined" ? localStorage.getItem("default_color") || "#009DB5" : "#009DB5",
    secondary_color: typeof window !== "undefined" ? localStorage.getItem("secondary_color") || "#F94C8E" : "#F94C8E",
    mix_background_layout: "light-only",
  },
  router_animation: "fadeIn",
};

export default ConfigDB;
