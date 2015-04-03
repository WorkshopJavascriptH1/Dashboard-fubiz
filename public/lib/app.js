$(function () {
    // Quand le document est pret
    $(document).ready(Container.loadUsers);

    // Quand on click sur le bouton "More infos"
    $('#container').on('click', 'a[data-infos]', Container.loadInfosUser);

    // Quand on click sur le bouton "Back"
    $('#container').on('click', '#back', Container.loadUsersBack);

    // Quand on change la date
    $('#container').on('blur', '#dateChange', Container.changeDateInfosUser);
});
