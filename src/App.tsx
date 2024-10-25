import { useEffect, useState } from 'react'
import {useTheme} from './ThemeContext'
import './App.css'

interface TodoItem {  //objeto principal
  id:string,
  texto:string,
  completado:boolean
}

function App() {

  const {theme, toggleTheme} = useTheme()
  const [todos,setTodos] = useState<TodoItem[]>([])  //lista completa com texto, id, e completado?
  const [newTodo, setNewTodo] = useState<string>('')  //texto digitado no input sera guardado aqui
  const [estaCarregado, setEstacarregado] = useState<boolean>(false) //buscar estados(todos) da memória


//criaremos 3 funções que atualizam a lista:
//1 cria sempre um texto for enviado, cria uma lista
  const adicionarTarefa = ():void => {
    if(newTodo !== ''){               //se texto nao estiver vazio
      const newId = crypto.randomUUID() //função que cria id aleatorio e guarda 
      const newTodoItem: TodoItem = {   //fez uma cópia do objeto interface TodoItem, agora so colocando o valor
        id: newId,
        texto: newTodo,
        completado: false  //manipula o cheked do input checkbox
      }
      setTodos([...todos, newTodoItem]) //adiciona um objeto, mas mantém os objetos antigos
      setNewTodo('') //limpa o texto digitado depois que foi enviado para a lista
    }
  }
//2 atualiza removendo a lista com id clicado
  const removerTarefa = (id:string):void=> { //recebemos por parâmetro o id atual de cada lista(definimos la em baixo)
    const tarefasAtualizadas = todos.filter((todo) => todo.id !== id) //filtra todos os ids que são diferente do que será apagado
    setTodos(tarefasAtualizadas)     //atualizamos a lista sem o id da lista do botão apagar
  }
//3 atualiza o estado da lista atraves do checkbox, por id também 
  const marcarCompleto = (id: string):void => { //recebemos por parâmetro o id atual de cada lista(definimos la em baixo)
    const todosAtualizados = todos.map((todo) => { //mapeamos toda a lista para encontrar o id do ckeckbox
      if (todo.id === id) { //se o id for igual o id atual
        return {...todo, completado: !todo.completado} //retorna toda a lista e so muda o completado do id cliado
      }
      return todo  //preserva todos os itens que não foram clicados, sem modificá-los.
    })
    setTodos(todosAtualizados) //atualiza a key completado do objeto original
  }


  //contagem de tarefas concluidas Professor/Meu
  const obterTarefasConcluidas = (): TodoItem[] => {
    return todos.filter(todo => todo.completado) //pega apenas os que estão marcados com checkbox
  }

  const concluirTarefa =(): number => {
    const atualizarLista = todos.filter((todo) => todo.completado == true)
    return atualizarLista.length
  }

  //1 pegar do Localstorage/2 salvar no localstorage
  //2 salvar o que foi adicionado
  useEffect(()=> {
    if(estaCarregado) { //se ja pegamos do localstorage, enviamos a lista atual
      localStorage.setItem('tarefass', JSON.stringify(todos)) //criamos um localstorage de nome 'tarefass' e add todos em JSON
    }
  },[todos, estaCarregado]) //toda vez que a lista for mudada, useEfect ativa e envia para localstorage

  //1 pegar o que ja tem
  useEffect(()=> {
    const tarefasDaMemoria= localStorage.getItem('tarefass') //recebe a lista que foi enviada 
    if (tarefasDaMemoria) { //se tiver :
      setTodos(JSON.parse(tarefasDaMemoria)) //pegamos da memória e colocamos na nossa lista
    }

    setEstacarregado(true) //se ja pegamos ou se nao tem nada
  },[])

  return (
     <div className={`app ${theme}`}>
      <div className={`container ${theme}`}>
        <h1>Lista de Tarefas : {concluirTarefa()}/{todos.length}</h1>
        <div className='input-container'>
          <input type="text" value={newTodo} onChange={(e)=> setNewTodo(e.target.value)} />
          <button onClick={adicionarTarefa}>Adicionar tarefa</button>
        </div>
        <ol>
          {
            todos.map((todo) => ( //é um laço de repetição para cada item da lista, cria novas linhas
              <li key={todo.id}>
                <input type="checkbox" checked={todo.completado} onChange={() => marcarCompleto(todo.id)}/>
                <span style={{textDecoration: todo.completado? 'line-through': 'none'}}>{todo.texto}</span>
                <button onClick={()=>removerTarefa(todo.id)}>Apagar</button>
              </li>
            ))
          }
        </ol>
        <button onClick={toggleTheme}>
          Alterar para o Tema {theme==='light'? 'escuro': 'claro'}
        </button>
      </div>
     </div>
  )
}

export default App
