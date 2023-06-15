export class Restaurant {
    name?: string;
    description?: string;
    photo ?: string;

    constructor(name :string,description :string, photo : string){
        this.name =name;
        this.description = description;
        this.photo = photo;
    }
}