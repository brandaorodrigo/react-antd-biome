import { Button, Input, Table } from 'antd';
import { Select } from '@/components/Form';

const Private: React.FC = () => {
    return (
        <div>
            <Input placeholder='Insira' />
            <br />
            <br />
            <Select
                options={[
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                ]}
            />
            <br />
            <br />
            <Button block type='primary'>
                Enviar
            </Button>
            <br />
            <br />
            <Table
                columns={[
                    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
                    { title: 'Idade', dataIndex: 'idade', key: 'idade' },
                    { title: 'Email', dataIndex: 'email', key: 'email' },
                ]}
                dataSource={[
                    { key: '1', nome: 'João', idade: 28, email: 'joao@email.com' },
                    { key: '2', nome: 'Maria', idade: 34, email: 'maria@email.com' },
                    { key: '3', nome: 'Carlos', idade: 22, email: 'carlos@email.com' },
                ]}
            />
        </div>
    );
};

export default Private;
