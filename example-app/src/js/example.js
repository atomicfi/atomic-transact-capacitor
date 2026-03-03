import { TransactPlugin } from '@atomicfi/transact-capacitor';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    TransactPlugin.echo({ value: inputValue })
}
