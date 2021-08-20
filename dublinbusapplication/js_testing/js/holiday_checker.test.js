function formattedDate() {
    // gets current date and converts it to the google calendar API format (YYYY-MM-DD)
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    return year + '-' + month + '-' + day;
}


test('type of formattedDate function output', () => {
    expect(typeof formattedDate()).toBe("string")
})

test('content of formattedDate function', () => {
    var full_date = new Date();

    expect(formattedDate()).toContain(full_date.getFullYear().toString())
    expect(formattedDate()).toContain((full_date.getMonth()+1).toString())
    expect(formattedDate()).toContain(full_date.getDate().toString())
    
})