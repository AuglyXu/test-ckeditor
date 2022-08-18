import { Form, Button } from 'antd'
import CkEditor from './CkEditorComponent'

const App = () => {
    const [form] = Form.useForm()

    const handleFinish = (value) => {
        console.log('ckeditor', value)
    }

    return (
        <Form form={form} name="test-ckeditor" layout="vertical" onFinish={handleFinish}>
            <Form.Item name="ckEditor" label="ckeditor" rules={[{ required: true, message: '请填写富文本' }]}>
                <CkEditor />
            </Form.Item>
            <Form.Item >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default App;