import LoginForm from "../components/Forms/LoginForm/LoginForm"
import MainLayout from "../layouts/MainLayout/MainLayout"

export default function LoginPage () {
    return (
        <MainLayout title='Вход'>
            <LoginForm />
        </MainLayout>
    )
}