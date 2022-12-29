import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { increment,decrement} from "./counterSlice";

export default function ContactPage() {
    const dispath = useAppDispatch();
    const { data, title } = useAppSelector(state => state.counter);
    return (
        <>
            <Typography variant="h2">
                {title}
            </Typography>
            <Typography variant="h5">
                The data is: {data}
            </Typography>

            <ButtonGroup>
                <Button
                    onClick={() => dispath(decrement(1))}
                    variant='contained'
                    color="error">
                    Decrement
                </Button>
                <Button
                    onClick={() => dispath(increment(1))}
                    variant='contained'
                    color="primary">
                    Increment
                </Button>
                <Button
                    onClick={() => dispath(increment(5))}
                    variant='contained'
                    color="secondary">
                    Increment by 5
                </Button>

            </ButtonGroup>
        </>

    )
}