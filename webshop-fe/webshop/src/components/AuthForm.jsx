import { useForm } from 'react-hook-form';
import {
    Button,
    TextField,
    Grid,
    Box,
    Typography
} from '@mui/material';

const AuthForm = ({ onSubmit, isRegister = false }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <Box width="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {isRegister && (
                        <>
                            <TextField
                                label="Tên người dùng"
                                fullWidth
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                {...register('username', { required: 'Tên người dùng là bắt buộc' })}
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Họ"
                                        fullWidth
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                        {...register('firstName', { required: 'Họ là bắt buộc' })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tên"
                                        fullWidth
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                        {...register('lastName', { required: 'Tên là bắt buộc' })}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                {...register('email', {
                                    required: 'Email là bắt buộc',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
                                })}
                            />

                            <TextField
                                label="Số điện thoại"
                                fullWidth
                                {...register('phone')}
                            />
                        </>
                    )}

                    {!isRegister && (
                        <TextField
                            label="Tên người dùng"
                            fullWidth
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            {...register('username', { required: 'Tên người dùng là bắt buộc' })}
                        />
                    )}

                    <TextField
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {isRegister ? 'Đăng Ký' : 'Đăng Nhập'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default AuthForm;
