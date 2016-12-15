import {Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges} from "@angular/core";
import {ComponentBase} from "../../../components/common/component-base";
import {CommandArgumentModel} from "cwlts/models/d2sb";
import {Validation} from "cwlts/models/helpers/validation";

require("./argument-list.component.scss");

@Component({
    selector: "ct-argument-list",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ct-form-panel [collapsed]="false">
            <span class="tc-header">
                Arguments
            </span>
            
            <div class="tc-body">
                <ct-blank-tool-state *ngIf="!readonly && !arguments.length"
                                     [title]="'Command line arguments for your tool'"
                                     [buttonText]="'Add an Argument'"
                                     (buttonClick)="addEntry()">
                </ct-blank-tool-state>
                
                <div *ngIf="arguments.length" class="container">
                    <div class="gui-section-list-title row">
                        <div class="col-sm-4">Value</div>
                        <div class="col-sm-3">Prefix</div>
                        <div class="col-sm-3">Separate</div>
                        <div class="col-sm-2">#</div>
                    </div>
                
                    <ul class="gui-section-list">
                        <li *ngFor="let entry of arguments; let i = index"
                            [ct-validation-class]="entry.validation"
                            class="gui-section-list-item clickable row">
                            
                            <ct-tooltip-content #ctt>
                                <span *ngIf="entry.valueFrom && !entry.valueFrom.isExpression">
                                {{ entry.toString() }}
                                </span>
                                
                                <ct-code-preview *ngIf="ctt.isIn && entry.valueFrom && entry.valueFrom.isExpression"
                                                 (viewReady)="ctt.show()"
                                                 [content]="entry.toString()"></ct-code-preview>
                            </ct-tooltip-content>
                            
                            <div class="col-sm-4 ellipsis" [ct-tooltip]="ctt" [tooltipPlacement]="'top'">
                                <ct-validation-preview [entry]="entry.validation"></ct-validation-preview>
                                <span>
                                    {{ entry.toString() }}
                                </span>
                            </div>
                            
                            <div class="col-sm-3 ellipsis" [title]="entry.prefix">
                                <span *ngIf="entry.prefix">{{ entry.prefix }}</span>
                                <i *ngIf="!entry.prefix" class="fa fa-fw fa-times"></i>
                            </div>
                            
                            <div class="col-sm-3 ellipsis">
                                <i class="fa fa-fw fa-times" [class.fa-check]="entry.separate"></i>
                            </div>
                            
                            <div class="ellipsis" [ngClass]="{
                                'col-sm-1': !readonly,
                                'col-sm-2': readonly
                            }" >{{ entry.position || 0 }}</div>
                            
                            <div *ngIf="!readonly" class="col-sm-1 align-right">
                                <i [ct-tooltip]="'Delete'"
                                   class="fa fa-trash text-hover-danger" 
                                   (click)="removeEntry(i)"></i>
                            </div>
                        </li>
                    </ul>
                
                </div>
            
                
                <button *ngIf="!readonly && arguments.length" 
                        (click)="addEntry()" 
                        type="button" 
                        class="btn pl-0 btn-link no-outline no-underline-hover">
                    <i class="fa fa-plus"></i> Add an Argument
                </button>
            </div>
        </ct-form-panel>
    `
})
export class ArgumentListComponent extends ComponentBase implements OnChanges {

    @Input()
    public entries: CommandArgumentModel[] = [];

    @Input()
    public readonly = false;

    private arguments: CommandArgumentModel[] = [];

    private removeEntry(index) {
        this.arguments = this.arguments.slice(0, index).concat(this.arguments.slice(index + 1));
    }

    private repos() {
        console.log("Should reposition");
    }

    private addEntry() {
        this.arguments = this.arguments.concat([new CommandArgumentModel()]);
    }

    ngOnChanges(changes: SimpleChanges): void {

        this.arguments = changes["entries"].currentValue.map(entry => entry)
            .sort((a, b) => a.position - b.position);
    }
}