import { useEffect, useState } from "react";
// import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";
// import { useNavigate } from "react-router-dom";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "../../amplify/data/resource";
import Medico from "./Medico";
import Patient from "./Patient";
import Box from "@mui/material/Box";

// const client = generateClient<Schema>();

async function getUserInfo(): Promise<{
  groups: string[];
  userId: string | null;
  email: string | null;
}> {
  try {
    const session = await fetchAuthSession();
    const payload = session.tokens?.idToken?.payload;
    
    const groupsRaw = payload?.["cognito:groups"] || [];
    const groups = Array.isArray(groupsRaw)
      ? groupsRaw.filter((g) => typeof g === "string")
      : [];
    
    return {
      groups,
      userId: typeof payload?.sub === 'string' ? payload.sub : null,
      email: typeof payload?.email === 'string' ? payload.email : null,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return { groups: [], userId: null, email: null };
  }
}

function Home() {
  //   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  //   const { signOut } = useAuthenticator();
  //   const navigate = useNavigate();

  const [group, setGroup] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null>(null);

  useEffect(() => {
    getUserInfo().then((info) => {
      console.log("=== HOME COMPONENT USER INFO ===");
      console.log("User logged in:", {
        userId: info.userId,
        email: info.email,
        groups: info.groups
      });
      console.log("Full payload sub:", info.userId);
      console.log("Timestamp:", new Date().toISOString());
      console.log("===============================");
      
      setUserInfo(info);
      
      if (info.groups.includes("Medico")) {
        setGroup("Medico");
      } else {
        setGroup("Patient");
      }
    });
  }, []);

  if (!group) return null; // or a loading spinner

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="rgb(227, 242, 253)"
      width="100vw"
    >
      {group === "Medico" ? (
        <Medico userInfo={userInfo} />
      ) : (
        <Patient userInfo={userInfo} />
      )}
    </Box>
  );
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
