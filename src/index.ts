
import { Grid } from "./widgets/grid/grid";
import { Tree, INode } from "./widgets/tree/tree";
import { IMeta } from "./widgets/grid/viewgrid/viewgrid";

import { DragDropPlugin } from "./widgets/grid/plugins/dragDrop/dragDropPlugin";  // не реализован !
import { ResizeColumnsPlugin } from "./widgets/grid/plugins/resizeColumns/resizeColumnsPlugin";
import { TotalPlugin } from "./widgets/grid/plugins/total/totalPlugin";
import { ViewColumnsPlugin } from "./widgets/grid/plugins/viewColumns/ViewColumnsPlugin"; // не дописан !
import { TreeFilterPlugin } from "./widgets/tree/plugins/treeFilter/treeFilterPlugin";
import { PinRowPlugin } from "./widgets/tree/plugins/pinRow/pinRowPlugin";

import "./index.scss";

Grid.registerPlugin({ type: "dragDropGrid", plugin: DragDropPlugin });
Grid.registerPlugin({ type: "resizeColumns", plugin: ResizeColumnsPlugin });
Grid.registerPlugin({ type: "total", plugin: TotalPlugin });
Grid.registerPlugin({ type: "viewColumns", plugin: ViewColumnsPlugin });
Grid.registerPlugin({ type: "treeFilter", plugin: TreeFilterPlugin });
Grid.registerPlugin({ type: "pinRow", plugin: PinRowPlugin });

(window as any).nw = {
    Grid,
    Tree
};
