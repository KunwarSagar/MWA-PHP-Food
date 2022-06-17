import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FoodService } from '../food.service';
import { Food } from '../foods/foods.component';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  // fontawesome
  faTrash = faTrash;
  isLoggedIn!:boolean;

  food!: Food;

  imageUrl!: string;

  constructor(private route: ActivatedRoute, private foodService: FoodService, private router: Router, private authService:AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.food = new Food("", "", "", "", []);
  }

  ngOnInit(): void {
    const foodId = this.route.snapshot.params["foodId"];
    this.foodService.getFood(foodId).subscribe({
      next: food => {
        if (food) {
          this.food = food;
          this.imageUrl = environment.API_BASE_URL + "/" + food.imageUrl;
        } else {
          this.router.navigate(['/not-found']);
        }
      },
      error: err => {
        this.router.navigate(['/not-found']);
      }
    });
  }

  /**
   * Delete the food on clicking the delete button
   * We need a food Id for that
   */
  delete(): void {
    this.foodService.deleteFood(this.food._id).subscribe({
      next: food => {
        if (food == null) {
          alert("Deleted");
          this.router.navigate(['/foods']);
        }
      },
      error: err => {
        alert("Something went wrong");
      }
    });
  }
}
