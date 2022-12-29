import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';



const theme = createTheme();

export default function Register() {
    let navigation = useNavigate()

    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: 'all'
    });

    function handleApiErrors(errors: any) {
        if (errors) {
            errors.forEach((error: string) => {
                if (error.includes('Password')) {
                    setError('password', { message: error })
                } else if (error.includes('Email')) {
                    setError('email', { message: error })
                } else if (error.includes('UserName')) {
                    setError('username', { message: error })
                }
            });
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component={Paper} maxWidth="sm"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>

                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form"
                    onSubmit={handleSubmit((data) =>
                        agent.Account.register(data)
                        .then(() => {
                            toast.success('Registration successful - you can now login');
                            navigation('/login')
                        })
                        .catch((error) => {
                            handleApiErrors(error)
                        })
                    )}
                    noValidate sx={{ mt: 1 }}
                ><TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        {...register('username', { required: 'User name is required' })}
                        error={!!errors.username}
                        helperText={errors?.username?.message?.toString()}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email address"
                        {...register('email',
                            {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                                    message: 'Not a valid email address'
                                }
                            },

                        )}

                        error={!!errors.email}
                        helperText={errors?.email?.message?.toString()}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        {...register('password', { 
                            required: 'Password name is required' ,
                            pattern:{
                                value:/(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                                message:'password does not meet complexity requarements. 1 small-case letter, 1 Capital letter, 1 digit, 1 special character and the length should be between 6-10 characters.'
                                
                            }    })}
                            //regexp form https://regexlib.com/
                        error={!!errors.password}
                        helperText={errors?.password?.message?.toString()}
                    />

                    
                    <LoadingButton
                        disabled={!isValid}
                        loading={isSubmitting}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </LoadingButton>
                    <Grid container>

                        <Grid item>
                            <Link to={'/login'}>
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>


            </Container>
        </ThemeProvider>
    );
}