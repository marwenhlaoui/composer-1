import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CWLModule} from "../cwl/cwl.module";
import {EditorCommonModule} from "../editor-common/editor-common.module";
import {LayoutModule} from "../layout/layout.module";
import {UIModule} from "../ui/ui.module";
import {CommandLinePreviewComponent} from "./components/command-line-preview/command-line-preview.component";
import {DescriptionComponent} from "./object-inspector/common-sections/description-section/description.component";
import {BasicInputSectionComponent} from "./object-inspector/input-inspector/basic-section/basic-input-section.component";
import {InputBindingSectionComponent} from "./object-inspector/input-inspector/input-binding/input-binding-section.component";
import {StageInputSectionComponent} from "./object-inspector/input-inspector/stage-input-section/stage-input-section.component";
import {ToolInputInspectorComponent} from "./object-inspector/input-inspector/tool-input-inspector.component";
import {BasicOutputSectionComponent} from "./object-inspector/output-inspector/output-basic-section/basic-output-section.component";
import {OutputEvalSectionComponent} from "./object-inspector/output-inspector/output-eval-section/output-eval.component";
import {OutputMetaDataSectionComponent} from "./object-inspector/output-inspector/output-metadata-section/output-metadata.component";
import {ToolOutputInspectorComponent} from "./object-inspector/output-inspector/tool-output-inspector.component";
import {SecondaryFilesComponent} from "./object-inspector/secondary-files/secondary-files.component";
import {ArgumentInspectorComponent} from "./sections/arguments/argument-inspector.component";
import {ArgumentListComponent} from "./sections/arguments/argument-list.component";
import {BaseCommandListComponent} from "./sections/base-command/base-command-list/base-command-list.component";
import {BaseCommandStringComponent} from "./sections/base-command/base-command-string/base-command-string.component";
import {BaseCommandComponent} from "./sections/base-command/base-command.component";
import {DockerRequirementComponent} from "./sections/docker/docker-requirement.component";
import {FileDefInspectorComponent} from "./sections/file-def-list/file-def-inspector.component";
import {FileDefListComponent} from "./sections/file-def-list/file-def-list.component";
import {LiteralExpressionInputComponent} from "./sections/file-def-list/literal-expression-input.component";
import {ToolHintsComponent} from "./sections/hints/tool-hints.component";
import {ToolInputListComponent} from "./sections/inputs/tool-input-list.component";
import {ToolInputsComponent} from "./sections/inputs/tool-inputs.component";
import {ToolCodesComponent} from "./sections/other/codes/tool-codes.component";
import {ToolStreamsComponent} from "./sections/other/streams/tool-streams.component";
import {ToolOtherComponent} from "./sections/other/tool-other.component";
import {ToolOutputListComponent} from "./sections/outputs/tool-output-list.component";
import {ToolOutputsComponent} from "./sections/outputs/tool-outputs.component";
import {ResourcesComponent} from "./sections/resources/resources.component";
import {ToolEditorComponent} from "./tool-editor.component";
import {ToolVisualEditorComponent} from "./tool-visual-editor/tool-visual-editor.component";
import { BaseCommandEditorComponent } from './sections/base-command-editor/base-command-editor.component';
import { BaseCommandExpressionListComponent } from './sections/base-command-editor/base-command-expression-list/base-command-expression-list.component';
import { BaseCommandStringNewComponent } from './sections/base-command-editor/base-command-string-new/base-command-string-new.component';

@NgModule({
    declarations: [
        ArgumentInspectorComponent,
        ArgumentListComponent,
        BasicInputSectionComponent,
        BasicOutputSectionComponent,
        CommandLinePreviewComponent,
        DescriptionComponent,
        FileDefInspectorComponent,
        FileDefListComponent,
        InputBindingSectionComponent,
        LiteralExpressionInputComponent,
        OutputEvalSectionComponent,
        OutputMetaDataSectionComponent,
        ResourcesComponent,
        SecondaryFilesComponent,
        StageInputSectionComponent,
        ToolInputInspectorComponent,
        ToolInputListComponent,
        ToolInputsComponent,
        ToolOutputInspectorComponent,
        ToolOutputListComponent,
        ToolOutputsComponent,
        ToolEditorComponent,
        ToolVisualEditorComponent,
        DockerRequirementComponent,
        BaseCommandComponent,
        ToolHintsComponent,
        BaseCommandListComponent,
        ToolStreamsComponent,
        BaseCommandStringComponent,
        ToolOtherComponent,
        ToolCodesComponent,
        BaseCommandEditorComponent,
        BaseCommandExpressionListComponent,
        BaseCommandStringNewComponent
    ],
    exports: [
        ToolEditorComponent,
        CommandLinePreviewComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        LayoutModule,
        ReactiveFormsModule,
        EditorCommonModule,
        CWLModule,
        UIModule
    ]
})
export class ToolEditorModule {

}
