
import { Component, on, IComponentProps } from "./components/component";
import { IRef } from "./components/internal";
import { template } from "./modules/template";

import { dom, IDom } from "./modules/dom";
import { EmitterEvent } from "./modules/event/emitter.event";
import { StoreEvent } from "./modules/event/store.event";

import { methodCall, merge } from "./util/util";
import { IHashMap, IHashMapAny, IHashMapBoolean, IHashMapString } from "./util/util";
import { event } from "./util/event";

// -------------------------------------------

export { Component, on, IComponentProps, IRef, template };

export { EmitterEvent, StoreEvent };
export { dom, IDom };

export { IHashMap, IHashMapAny, IHashMapBoolean, IHashMapString };

export { event, merge, methodCall };
