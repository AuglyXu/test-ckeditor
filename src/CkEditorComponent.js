import { useCallback } from 'react'
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
import ClassicEditor from './ckeditor';
import Context from '@ckeditor/ckeditor5-core/src/context';
import MyUploadAdapter from './plugin/MyUploadAdapter'

function MyCustomUploadAdapterPlugin(editor) {
  const ed = editor;
  ed.plugins.get('FileRepository').createUploadAdapter = (loader) => new MyUploadAdapter(loader);
}

function CkEditor(props) {
  const { onChange, readOnly, value, onError } = props;

  const handleChange = useCallback((event, editor) => {
    const data = editor.getData();
    onChange(data)
  }, [onChange])

  const handleBlur = useCallback((event, editor) => {
    const data = editor.getData();
    onChange(data)
  }, [onChange])

  return (
    <CKEditorContext context={Context}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          // 这里可以自定义配置项
          removePlugins: ['link', 'insertTable', 'mediaEmbed'],
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'imageUpload'],
          // toolbar: ['bold', 'italic']
        }}
        disabled={readOnly}
        data={value || '<p />'}
        onReady={editor => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor1 is ready to use!', editor);
        }}
        // 相当于 editor.model.document.on("change:data", handleChange)
        onChange={handleChange}
        onBlur={handleBlur}
        onError={onError || console.error}
      />
    </CKEditorContext>
  );
}

export default CkEditor;
