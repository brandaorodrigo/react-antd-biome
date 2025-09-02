import { Input, type InputProps } from 'antd';

type FetchProps = { street?: string; neighborhood?: string; city?: string; state?: string };

const fetchAddress = async (value: string): Promise<FetchProps> => {
    const numeric = String(value).replace(/\D/g, '');
    return fetch(`https://brasilapi.com.br/api/cep/v2/${numeric}`, {
        method: 'GET',
        redirect: 'follow',
    })
        .then((response) => {
            if (response.status !== 200) {
                throw 'error';
            }
            return response.json();
        })
        .then((json: any) => ({
            city: json?.city,
            neighborhood: json?.neighborhood,
            state: json?.state,
            street: json?.street,
        }))
        .catch(() =>
            fetch(`https://viacep.com.br/ws/${numeric}/json`, {
                method: 'GET',
                redirect: 'follow',
            })
                .then((response) => {
                    if (response.status !== 200) {
                        throw 'error';
                    }
                    return response.json();
                })
                .then((json: any) => {
                    if (json?.erro) {
                        throw 'error';
                    }
                    return {
                        city: json?.localidade,
                        neighborhood: json?.bairro,
                        state: json?.uf,
                        street: json?.logradouro,
                    };
                })
                .catch(() => ({
                    city: undefined,
                    neighborhood: undefined,
                    state: undefined,
                    street: undefined,
                })),
        );
};

type InputZipcodeProps = InputProps & {
    onResponse?: (values: FetchProps) => void;
    onSearch?: () => void;
};

const InputZipcode: React.FC<InputZipcodeProps> = ({ onBlur, onSearch, onResponse, ...props }) => {
    return (
        <Input
            maxLength={9}
            onBlur={async (e) => {
                const value = e?.target?.value;
                if (onResponse) {
                    if (onSearch) {
                        onSearch();
                    }
                    const response = await fetchAddress(value);
                    onResponse(response);
                }
                if (onBlur) {
                    onBlur(e);
                }
            }}
            {...props}
        />
    );
};

export default InputZipcode;
