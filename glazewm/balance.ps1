# Resize every tiling container in a workspace (default: focused) to equal sizes,
# along both horizontal and vertical splits.
# GlazeWM has no built-in balance command, so resize each container by pixels.
param([string]$Workspace)

function Get-Workspace {
    $workspaces = (glazewm query workspaces | ConvertFrom-Json).data.workspaces
    if ($Workspace) { return $workspaces | Where-Object { $_.name -eq $Workspace } }
    return $workspaces | Where-Object { $_.hasFocus }
}

function Get-TilingChildren($node) {
    @($node.children | Where-Object { $null -ne $_.tilingSize })
}

# Returns the first tiling child whose size is off from an equal share, with its axis.
function Find-Unbalanced($node) {
    $children = Get-TilingChildren $node
    if ($children.Count -ge 2) {
        $axis = if ($node.tilingDirection -eq 'vertical') { 'height' } else { 'width' }
        $target = 1 / $children.Count
        $off = $children | Where-Object { [math]::Abs($_.tilingSize - $target) -gt 0.005 } | Select-Object -First 1
        if ($off) { return @{ Node = $off; Axis = $axis; Target = $target } }
    }
    foreach ($child in $children) {
        $found = Find-Unbalanced $child
        if ($found) { return $found }
    }
}

# Resizing a window resizes its ancestor split along that split's parent axis.
function Get-FirstWindow($node) {
    if ($node.type -eq 'window') { return $node }
    foreach ($child in Get-TilingChildren $node) {
        $window = Get-FirstWindow $child
        if ($window) { return $window }
    }
}

# Resizing one container shrinks its siblings, so re-query after every resize.
for ($i = 0; $i -lt 50; $i++) {
    $ws = Get-Workspace
    if (-not $ws) { return }
    $off = Find-Unbalanced $ws
    if (-not $off) { return }

    $node = $off.Node
    $axis = $off.Axis
    $pxPerUnit = $node.$axis / $node.tilingSize
    $delta = [int][math]::Round(($off.Target - $node.tilingSize) * $pxPerUnit)
    if ($delta -eq 0) { return }
    $sign = if ($delta -gt 0) { '+' } else { '' }
    $window = Get-FirstWindow $node
    glazewm command --id $window.id resize "--$axis" "$sign${delta}px" | Out-Null
}
