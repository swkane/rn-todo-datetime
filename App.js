import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  Switch
} from "react-native";
import DatePicker from "react-native-datepicker";
import moment from "moment-timezone";
import styled from "styled-components/native";

export default class App extends React.Component {
  state = {
    addTaskTitle: "",
    addTaskDate: new Date(),
    tasks: []
  };

  componentDidMount() {
    this.reloadTasks();
  }

  addTask = async () => {
    const tasks = await this.tasks();
    const id = Date.now();
    const taskDate = moment(this.state.addTaskDate)
      .utc()
      .toDate();
    tasks.push({
      title: this.state.addTaskTitle,
      date: taskDate,
      completed: false,
      id
    });
    this.setState({ addTaskTitle: "" });
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    this.reloadTasks();
  };

  updateTask = async (task, updates) => {
    const tasks = await this.tasks();
    for (const t of tasks) {
      if (t.id == task.id) {
        t.completed = updates.completed;
        break;
      }
    }
    console.log("updatedTasks", tasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    this.reloadTasks();
  };

  tasks = async () => {
    const storedTasks = await AsyncStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  };

  reloadTasks = async () => {
    const tasks = await this.tasks();
    this.setState({ tasks });
  };

  renderTask = task => {
    const taskDate = moment(task.date)
      .tz(moment.tz.guess())
      .format("LLL");
    return (
      <Task key={task.id}>
        <View style={{ flex: 1 }}>
          <Text>{task.title}</Text>
          <Text>{taskDate}</Text>
        </View>
        <View>
          <Switch
            value={task.completed}
            onValueChange={value => this.updateTask(task, { completed: value })}
          />
        </View>
      </Task>
    );
  };

  render() {
    return (
      <Container>
        <Welcome>Tasks</Welcome>
        <SectionContainer>
          <Header>Add Task</Header>
          <InputField
            value={this.state.addTaskTitle}
            onChangeText={title => this.setState({ addTaskTitle: title })}
          />
          <DatePicker
            style={styles.inputField}
            mode="datetime"
            date={this.state.addTaskDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={date => this.setState({ addTaskDate: date })}
          />
          <Button title="Add" onPress={this.addTask} />
        </SectionContainer>
        <SectionContainer>
          <Header>My Tasks</Header>
          {this.state.tasks.map(this.renderTask)}
        </SectionContainer>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
`;

const Welcome = styled.Text`
  font-size: 20;
  text-align: center;
`;

const Header = styled.Text`
  font-size: 16;
  font-weight: bold;
  margin-bottom: 10;
`;

const SectionContainer = styled.View`
  padding: 5px;
  margin: 5px;
`;

const InputField = styled.TextInput`
  width: 100%;
  height: 40;
  border-width: 1;
  border-color: #aaa;
  margin: 5px;
`;

const Task = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #eee;
  padding: 5px;
  margin-bottom: 5px;
`;

const styles = StyleSheet.create({
  inputField: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#aaa",
    margin: 5
  }
});
