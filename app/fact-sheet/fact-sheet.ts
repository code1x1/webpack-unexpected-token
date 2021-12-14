import './fact-sheet.scss';

import ng from 'angular';

export class AtomFactSheetController implements ng.IController {
    public static $inject: string[] = ['$translate'];

    public property: any;
    public descriptionToggle = false;

    public constructor() {}

    public getDateTranslation = (): string => {

        return '';
    };

    public set visiblePrice(_) {} /* tslint:disable-line:no-empty */
    public get visiblePrice(): string {
        return '1$';
    }

    public get descriptionIsArray(): boolean {
        return Array.isArray(this.property.description);
    }
}

export class AtomFactSheetComponent implements ng.IComponentOptions {
    public bindings = {
        property: '<'
    };
    public controller =  AtomFactSheetController;
    public template = require('./fact-sheet.html');
}
