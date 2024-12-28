local wezterm = require("wezterm")

return {
	automatically_reload_config = true,
	enable_tab_bar = false,
	window_close_confirmation = "NeverPrompt",
	window_decorations = "RESIZE",
	color_scheme = "Catppuccin Mocha",
	font = wezterm.font("0xProto Nerd Font", { weight = "Bold", stretch = "Normal", style = "Normal" }),
	font_size = 12.5,
	window_padding = {
		left = 2,
		right = 2,
		top = 2,
		bottom = "0.5cell",
	},
}
