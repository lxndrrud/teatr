import RegisterForm from "../components/Forms/RegisterForm/RegisterForm"
import MainLayout from "../layouts/MainLayout/MainLayout"

export default function RegisterPage () {
    return (
        <MainLayout title='Регистрация'>
            <RegisterForm />
        </MainLayout>
    )
}