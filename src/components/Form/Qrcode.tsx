import './Qrcode.scss';
import { Button } from 'antd';
import { useState } from 'react';
import { MdFlashlightOff, MdFlashlightOn, MdOutlineCameraswitch } from 'react-icons/md';
import { useZxing } from 'react-zxing';

type QrcodeProps = {
    onScan: (value: string) => void;
    onError?: (value: string) => void;
};

export const Qrcode: React.FC<QrcodeProps> = ({ onScan, onError }) => {
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

    const {
        ref,
        torch: { on: torchOn, off: torchOff, isOn: isTorchOn, isAvailable: isTorchAvailable },
    } = useZxing({
        paused: false,
        constraints: {
            video: {
                facingMode: facingMode,
            },
        },
        onDecodeResult: (result) => {
            onScan(result.getText());
        },
        onDecodeError: (error) => {
            if (onError) {
                onError(String(error));
            }
        },
        onError: (error) => {
            if (onError) {
                onError(String(error));
            }
        },
    });

    const switchCamera = () => {
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    };

    return (
        <div className='Qrcode'>
            <video
                className={facingMode === 'user' ? 'mirror' : ''}
                controls={false}
                ref={ref as React.RefObject<HTMLVideoElement>}
            >
                <track kind='captions' />
            </video>
            <Button
                className='switch'
                icon={<MdOutlineCameraswitch color='#fff' size={30} />}
                onClick={switchCamera}
                type='link'
            />
            <Button
                className='torch'
                hidden={!isTorchAvailable}
                icon={
                    isTorchOn ? (
                        <MdFlashlightOff color='#fff' size={27} />
                    ) : (
                        <MdFlashlightOn color='#fff' size={27} />
                    )
                }
                onClick={() => {
                    if (isTorchOn) {
                        torchOff();
                    } else {
                        torchOn();
                    }
                }}
                type='link'
            />
        </div>
    );
};

export default Qrcode;
