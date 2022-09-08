import MainLayout from "../layouts/MainLayout/MainLayout";

export default function Home() {
    return (
    <div>
        <MainLayout title="Главная страница">
            <h3 className="text-center sm:text-justify">
                Приветствуем вас в системе бронирования билетов театра на Оборонной!
            </h3>
        </MainLayout>
    </div>
    )
}