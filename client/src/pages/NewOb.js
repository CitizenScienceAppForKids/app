import React from "react";
import FormBio from '../components/templates/FormBio'
import FormEco from '../components/templates/FormEco'
import FormCli from '../components/templates/FormCli'
import * as QueryString from "query-string";

function NewOb(Project){

    const params = QueryString.parse(Project.location.search);
    
    if (params.type === "Biology"){
        return (
            <FormBio bio = {Project.pid} />
        )
    }
    else if (params.type === "Ecology"){
        return (
            <FormEco eco = {Project.pid} />
        )
    }
    else if (params.type === "Climatology"){
        return (
            <FormCli cli = {Project.pid} />
        )
    }
}

export default NewOb;