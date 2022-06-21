import FilePicker from "../components/UI/FilePicker/FilePicker";
import MainLayout from "../layouts/MainLayout/MainLayout";

export default function TestPage() {
    return (
        <>
            <MainLayout title="Тестовая страница">
                <FilePicker id={"csv"} />
            </MainLayout>
        </>
    )
}