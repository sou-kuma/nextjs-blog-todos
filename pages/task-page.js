import { useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { getAllTasksData } from "../lib/tasks";
import Task from "../components/Task";
import useSWR from "swr";
import StateContextProvider from "../context/StateContext";
import TaskForm from "../components/TaskForm";


const fetcher = (url) => fetch(url).then((res) => res.json());
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`;

export default function TaskPage({ staticfilteredTasks }) {

  const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: staticfilteredTasks,
  });
  const filteredTasks = tasks?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  useEffect(() => {
    mutate();
  }, []);

  return (
    <StateContextProvider>
      <Layout title="Task page">
        <TaskForm taskCreated={mutate} />
        <ul>
          {filteredTasks && filteredTasks.map((task) => <Task key={task.id} task={task} taskDeleted={mutate} />)}
        </ul>
        <Link href="/main-page">
          <div className="flex cursor-pointer mt-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
            </svg>
            <span>Back to main page</span>
          </div>
        </Link>
      </Layout>
    </StateContextProvider>
  )
};

export async function getStaticProps() {
  const staticfilteredTasks = await getAllTasksData();

  return {
    props: { staticfilteredTasks },
    revalidate: 3,
  };
}