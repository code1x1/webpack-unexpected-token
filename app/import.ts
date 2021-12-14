import * as ng from 'angular'
import { AtomFactSheetComponent } from './fact-sheet/fact-sheet'
const app = ng.module('app', [])

app.component('atomFactSheet', new AtomFactSheetComponent());
