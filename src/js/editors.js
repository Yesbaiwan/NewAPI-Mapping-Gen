// 编辑器操作
let allModelsEditor, finalModelsEditor;

function initEditors() {
  const cfg = {
    mode: 'text/plain',
    theme: 'material-darker',
    lineNumbers: true,
    lineWrapping: true,
    viewportMargin: Infinity,
  };
  allModelsEditor = CodeMirror.fromTextArea($('allModels'), cfg);
  finalModelsEditor = CodeMirror.fromTextArea($('finalModels'), cfg);
}

function getEditorValues() {
  return {
    allModels: allModelsEditor.getValue(),
    finalModels: finalModelsEditor.getValue(),
  };
}

function setEditorValues(a, f) {
  allModelsEditor.setValue(a);
  finalModelsEditor.setValue(f);
}

function clearEditors() {
  allModelsEditor.setValue('');
  finalModelsEditor.setValue('');
}

function copyToFinalModels() {
  finalModelsEditor.setValue(allModelsEditor.getValue());
  showStatus('✅ 源模型已复制到最终模型列表', 'success');
}

function clearEditor() {
  clearEditors();
  showStatus('✅ 模型列表已清空', 'success');
}
