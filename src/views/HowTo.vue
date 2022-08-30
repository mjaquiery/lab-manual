<template>
    <div class="about bg-blue-500 bg-opacity-20 flex flex-auto flex-col pl-12 pr-12 pt-6 overflow-y-scroll">
        <h1 class="mb-6">How to use the app?</h1>
        <h2 class="mb-4">Creating the structure of the manual</h2>
        <p class="mb-4">
            Upon opening the app you can see all the topics included in the lab manual template
            in a structured format in the center of the screen. When creating the lab manual template we tried to include
            a wide arrange of topics that could be discussed in a lab manual. However, it is possible
            that you feel that certain topics are not applicable to the needs of your particular lab.
        </p>
        <h3 class="mb-4">Getting more information on each topic</h3>
        <p class="mb-4">
            Thus, your first task is to keep only the topics that you want to talk about in your lab manual.
            You can get more information on a certain topic if you click on the header. 
        </p>
        <h3 class="mb-4">Deleting topics</h3>
        <p class="mb-4">
            If you want to drop
            a topic click on the bin icon. On the left side of the screen there is a list of the dropped topics.
            You can still recover these if you change your mind by dragging and dropping the header from the bin
            to the body of the manual.
        </p>
        <h3 class="mb-4">Rearranging topics</h3>
        <p class="mb-4">
            You can rearrange topics within the manual if you are not satisfied with the current structure. As 
            you can see the topics are presented in a nested structure. Use the left and right arrow icons to
            move the selected topic into lower and higher levels within the structure. To rearrange the order
            of the topics on the same level grab and drop the topic by the handle next to the header of the topic.
        </p>
        <h3 class="mb-4">Modifying existing topics</h3>
        <p class="mb-4">
            If want to slightly modify a topic you can click on the edit icon next to the topic header. This makes
            the title and the description of the topic editable. Once you are done with the changes you can click 
            on the edit button again to secure the changes.
        </p>
        <h3 class="mb-4">Adding new topics</h3>
        <p class="mb-6">
            If you would like to add new topics you can click on the plus icon at the desired level of the nested 
            structure. You must provide a title for the new topic however, adding a description is optional. You can 
            later delete, move, or modify these newly created topics as described above.
        </p>
        <h2 class="mb-4">Writing the content of the manual</h2>
        <p class="mb-4">
            When you are satisfied with the structure of your lab manual you can start describing filling it out with content
            for each topic. For some of the topics we wrote boilerplate texts to help you. There are two boilerplate options
            and you can choose the fitting one by clicking the radio button next to the text.
        </p>
        <p class="mb-4">
            If you are not satisfied with the presented options or there are no options you can write your own text after expanding
            a topic by clicking on the header then clicking on the plus icon after the description of the topic.
        </p>
        <p class="mb-6">
            In some cases you will notice that there are choosable dropdown options within the boilerplate texts. You can select the
            suitable option and the selection will be incorporated in the text of the manual upon download. Unfortunately, adding
            these dropdown options when you write your own text instead of choosing one of the boilerplate options is currently not 
            possible.
        </p>
        <h2 class="mb-4">Downloading the created manual</h2>
        <p class="mb-4">
            Once you finished creating your manual you can click on the download button on the right side of the screen. This opens a
            modal where you can choose from multiple different download formats. If you only want to use the app to create the
            structure of the manual you can choose the .doc output format and upload the document on gdocs to allow collaborative editing.
        </p>
        <p class="mb-4">
            However, if you choose to only edit the document in the app, you can download the manual in a .pdf format and share that with others,
            while downloading the manual in a .json file formatted according to our schema. Later on, we plan to make it possible for users
            to upload their manual in the app if it is according to our schema so they can do the updates within the app as well.
        </p>
    </div>
</template>