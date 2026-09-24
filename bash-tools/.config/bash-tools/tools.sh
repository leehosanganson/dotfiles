# Bash Tools

bash_tools_dir=$HOME/.config/bash-tools

# Factory
factory_bin=$bash_tools_dir/factory/bin
case ":$PATH:" in
  *":$factory_bin:"*) ;;
  *)
    if [ -n "$PATH" ]; then PATH=$PATH:$factory_bin; else PATH=$factory_bin; fi
    ;;
esac
export PATH

# Register scripts here
. "$bash_tools_dir/alias.sh"
. "$bash_tools_dir/gr.sh"
. "$bash_tools_dir/gw.sh"
. "$bash_tools_dir/ctx.sh"
. "$bash_tools_dir/lg.sh"
