import { useEffect, useState } from "react";
// import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";
// import { useNavigate } from "react-router-dom";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "../../amplify/data/resource";
import Medico from "./Medico";
import Patient from "./Patient";

// const client = generateClient<Schema>();

async function getUserGroups(): Promise<string[]> {
  try {
    const session = await fetchAuthSession();
    const groupsRaw = session.tokens?.idToken?.payload["cognito:groups"] || [];
    return Array.isArray(groupsRaw)
      ? groupsRaw.filter((g) => typeof g === "string")
      : [];
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
}

function Home() {
  //   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  //   const { signOut } = useAuthenticator();
  //   const navigate = useNavigate();

  const [group, setGroup] = useState<string | null>(null);

  useEffect(() => {
    getUserGroups().then((groups) => {
      if (groups.includes("Medico")) {
        setGroup("Medico");
      } else {
        setGroup("Patient");
      }
    });
  }, []);

  if (!group) return null; // or a loading spinner

  return group === "Medico" ? <Medico /> : <Patient />;
}

//   useEffect(() => {
//     getUserGroups().then((groups) => {
//       if (groups.includes("Medico")) {
//         navigate("/medico");
//       } else {
//         navigate("/patient");
//       }
//     });
//   }, []);

//   useEffect(() => {
//     client.models.Todo.observeQuery().subscribe({
//       next: (data) => setTodos([...data.items]),
//     });
//   }, []);

//   function createTodo() {
//     client.models.Todo.create({ content: window.prompt("Todo content") });
//   }

//   function deleteTodo(id: string) {
//     client.models.Todo.delete({ id });
//   }

//   return (
//     <main>
//       <button onClick={signOut}>Sign out</button>
//       <h1>My todos</h1>
//       <button onClick={createTodo}>+ new</button>
//       <ul>
//         {todos.map((todo) => (
//           <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
//             {todo.content}
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }

export default Home;
