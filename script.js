// Função para criar célula de entrada com tipo e valor padrão
function createInputCell(type = 'text', defaultValue = '') {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = type;
    input.value = defaultValue;
    input.addEventListener('input', updateSaldo);
    cell.appendChild(input);
    return cell;
}

// Função de adicionar nova linha na tabela
document.getElementById('addRow').addEventListener('click', () => {
    const table = document.querySelector('#livroCaixa tbody');
    const newRow = document.createElement('tr');
    ['date', 'text', 'number', 'number'].forEach(type => newRow.appendChild(createInputCell(type, type === 'number' ? 0 : '')));
    table.appendChild(newRow);
    updateSaldo();
});

// Função para atualizar o saldo em caixa
function updateSaldo() {
    const rows = document.querySelectorAll('#livroCaixa tbody tr');
    let totalEntrada = 0, totalSaida = 0;

    rows.forEach(row => {
        totalEntrada += parseFloat(row.cells[2].querySelector('input').value) || 0;
        totalSaida += parseFloat(row.cells[3].querySelector('input').value) || 0;
    });

    const saldo = totalEntrada - totalSaida;
    document.getElementById('saldo').innerText = saldo.toFixed(2);
}

// Exporta a tabela para XLSX
document.getElementById('download').addEventListener('click', () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [['Data', 'Descrição', 'Entrada', 'Saída']]; // Cabeçalhos
    document.querySelectorAll('#livroCaixa tbody tr').forEach(row => {
        worksheetData.push(Array.from(row.querySelectorAll('input')).map(input => input.value || ''));
    });
    worksheetData.push(['', '', 'Saldo em Caixa:', document.getElementById('saldo').innerText]);
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Livro Caixa');
    XLSX.writeFile(workbook, 'livro_caixa.xlsx');
});
